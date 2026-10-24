import { afterEach, beforeEach, describe, expect, mock, setSystemTime, spyOn, test } from "bun:test";
import { POST as login, DELETE as logout } from "@/app/api/admin/auth/route";
import { GET as readData } from "@/app/api/admin/data/[section]/route";
import { POST as save } from "@/app/api/admin/save/route";
import { POST as upload } from "@/app/api/admin/upload-resume/route";
import { POST as draft } from "@/app/api/github-draft/route";
import { POST as enhance } from "@/app/api/ai-enhance/route";
import projects from "@/data/projects.json";
import profile from "@/data/profile.json";
import experience from "@/data/experience.json";
import education from "@/data/education.json";
import skills from "@/data/skills.json";
import leadership from "@/data/leadership.json";
import certifications from "@/data/certifications.json";
import languages from "@/data/languages.json";
import site from "@/data/site.json";
import { AdminSaveRequestSchema } from "@/lib/types";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

const password = "test:password-with-colon";
const envKeys = ["ADMIN_PASSWORD", "GITHUB_TOKEN", "GITHUB_REPO_OWNER", "GITHUB_REPO_NAME", "NODE_ENV"] as const;
const originalEnv = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));

beforeEach(() => {
  Object.assign(process.env, {
    ADMIN_PASSWORD: password,
    GITHUB_TOKEN: "test-token",
    GITHUB_REPO_OWNER: "test-owner",
    GITHUB_REPO_NAME: "test-repo",
    NODE_ENV: "test",
  });
  // Prevent tests from ever reaching GitHub, email or paid AI services.
  stubFetch(() => Response.json({ sha: "file-sha", commit: { sha: "commit-sha" }, content: { sha: "b".repeat(40) } }));
});

afterEach(() => {
  mock.restore();
  setSystemTime();
  for (const key of envKeys) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else Object.assign(process.env, { [key]: originalEnv[key] });
  }
});

function request(path: string, body = "{", cookie?: string): Request {
  return new Request(`https://portfolio.test${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(cookie ? { Cookie: cookie } : {}) },
    body,
  });
}

function stubFetch(response: () => Response) {
  return spyOn(globalThis, "fetch").mockImplementation(Object.assign(
    () => Promise.resolve(response()),
    { preconnect: () => {} },
  ));
}

async function sessionCookie(): Promise<string> {
  const response = await login(request("/api/admin/auth", JSON.stringify({ password })));
  expect(response.status).toBe(200);
  return response.headers.get("set-cookie")!.split(";")[0];
}

describe("privileged route authorization", () => {
  const routes = [
    ["/api/admin/save", save],
    ["/api/admin/upload-resume", upload],
    ["/api/github-draft", draft],
    ["/api/ai-enhance", enhance],
  ] as const;

  for (const [path, handler] of routes) {
    test(`${path} rejects unauthenticated requests before processing the body`, async () => {
      const response = await handler(request(path));
      expect(response.status).toBe(401);
      expect(globalThis.fetch).not.toHaveBeenCalled();
    });
  }

  test("data reads require authentication", async () => {
    const response = await readData(new Request("https://portfolio.test/api/admin/data/projects"), {
      params: Promise.resolve({ section: "projects" }),
    });
    expect(response.status).toBe(401);
  });

  test("legacy password-bearing cookies are rejected", async () => {
    const cookie = `admin_session=${Buffer.from(`${password}:${Date.now()}`).toString("base64")}`;
    expect((await save(request("/api/admin/save", "{", cookie))).status).toBe(401);
  });

  test("a valid login authorizes data reads", async () => {
    const cookie = await sessionCookie();
    const response = await readData(new Request("https://portfolio.test/api/admin/data/projects", {
      headers: { Cookie: cookie },
    }), { params: Promise.resolve({ section: "projects" }) });
    expect(response.status).toBe(200);
    expect((await response.json()).data).toEqual(projects);
  });
});

describe("sessions", () => {
  test("cookies do not contain the password and production cookies are secure", async () => {
    Object.assign(process.env, { NODE_ENV: "production" });
    const response = await login(request("/api/admin/auth", JSON.stringify({ password })));
    const cookie = response.headers.get("set-cookie")!;
    const value = cookie.split(";")[0].slice("admin_session=".length);
    expect(Buffer.from(value, "base64").toString()).not.toContain(password);
    expect(cookie).toContain("HttpOnly");
    expect(cookie.toLowerCase()).toContain("samesite=strict");
    expect(cookie).toContain("Secure");
  });

  test("sessions expire on the server after 24 hours", async () => {
    setSystemTime(new Date("2026-10-24T10:00:00Z"));
    const cookie = await sessionCookie();
    setSystemTime(new Date("2026-10-25T10:00:01Z"));
    expect((await save(request("/api/admin/save", "{", cookie))).status).toBe(401);
  });

  test("tampering with a session is rejected", async () => {
    const cookie = await sessionCookie();
    const index = cookie.indexOf("=") + 1;
    const tampered = cookie.slice(0, index) + (cookie[index] === "a" ? "b" : "a") + cookie.slice(index + 1);
    expect((await save(request("/api/admin/save", "{", tampered))).status).toBe(401);
  });

  test("password rotation invalidates existing sessions", async () => {
    const cookie = await sessionCookie();
    process.env.ADMIN_PASSWORD = "rotated-password";
    expect((await save(request("/api/admin/save", "{", cookie))).status).toBe(401);
  });

  test("missing configuration and incorrect passwords fail closed", async () => {
    expect((await login(request("/api/admin/auth", '{"password":"wrong"}'))).status).toBe(401);
    delete process.env.ADMIN_PASSWORD;
    expect((await login(request("/api/admin/auth", JSON.stringify({ password })))).status).toBe(500);
    expect((await save(request("/api/admin/save"))).status).toBe(401);
  });

  test("logout clears the same secure cookie", async () => {
    Object.assign(process.env, { NODE_ENV: "production" });
    const cookie = (await logout()).headers.get("set-cookie")!;
    expect(cookie).toContain("Max-Age=0");
    expect(cookie).toContain("Secure");
  });
});

describe("save validation", () => {
  test.each(["../package", "../vercel", "__proto__", "constructor", "missing"])("rejects section %s without a commit", async (section) => {
    const cookie = await sessionCookie();
    const response = await save(request("/api/admin/save", JSON.stringify({ section, data: [] }), cookie));
    expect(response.status).toBe(400);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  test("rejects projects that would break static rendering", async () => {
    const cookie = await sessionCookie();
    const response = await save(request("/api/admin/save", JSON.stringify({
      section: "projects", data: [{ ...projects[0], githubUrl: "invalid-url" }],
    }), cookie));
    expect(response.status).toBe(400);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  test.each(["javascript:alert(1)", "data:text/html,test", "ftp://example.com"])("rejects unsafe project URL %s", async (githubUrl) => {
    const cookie = await sessionCookie();
    const response = await save(request("/api/admin/save", JSON.stringify({
      section: "projects", data: [{ ...projects[0], githubUrl }],
    }), cookie));
    expect(response.status).toBe(400);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  test("malformed authenticated JSON returns 400 without a commit", async () => {
    const cookie = await sessionCookie();
    expect((await save(request("/api/admin/save", "{", cookie))).status).toBe(400);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  test("valid content is committed with the expected path and JSON", async () => {
    const cookie = await sessionCookie();
    const response = await save(request("/api/admin/save", JSON.stringify({ section: "projects", data: projects }), cookie));
    expect(response.status).toBe(200);
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect(globalThis.fetch).toHaveBeenLastCalledWith(
      "https://api.github.com/repos/test-owner/test-repo/contents/data/projects.json",
      expect.objectContaining({ method: "PUT", body: expect.stringContaining("Update projects data via admin panel") }),
    );
  });
});

test("invalid draft and AI payloads are rejected before external calls", async () => {
  const cookie = await sessionCookie();
  for (const [path, handler] of [["/api/github-draft", draft], ["/api/ai-enhance", enhance]] as const) {
    expect((await handler(request(path, "{}", cookie))).status).toBe(400);
  }
  expect(globalThis.fetch).not.toHaveBeenCalled();
});

test("a renamed non-PDF cannot be uploaded as a resume", async () => {
  const cookie = await sessionCookie();
  const response = await upload(request("/api/admin/upload-resume", JSON.stringify({
    fileName: "resume.pdf", fileBase64: Buffer.from("not a PDF").toString("base64"),
  }), cookie));
  expect(response.status).toBe(400);
  expect(globalThis.fetch).not.toHaveBeenCalled();
});

test("the editor reads the latest GitHub content after a failed deployment", async () => {
  const cookie = await sessionCookie();
  Object.assign(process.env, { NODE_ENV: "production" });
  const latestProjects = [{ ...projects[0], title: "Saved but not deployed yet" }];
  const sha = "a".repeat(40);
  stubFetch(() => Response.json({
    encoding: "base64", content: Buffer.from(JSON.stringify(latestProjects)).toString("base64"), sha,
  }));
  const response = await readData(new Request("https://portfolio.test/api/admin/data/projects", {
    headers: { Cookie: cookie },
  }), { params: Promise.resolve({ section: "projects" }) });
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ success: true, data: latestProjects, sha });
  expect(globalThis.fetch).toHaveBeenCalledWith(
    "https://api.github.com/repos/test-owner/test-repo/contents/data/projects.json?ref=main",
    expect.objectContaining({ cache: "no-store" }),
  );
});

test("concurrent edits receive a conflict instead of overwriting newer content", async () => {
  const cookie = await sessionCookie();
  Object.assign(process.env, { NODE_ENV: "production" });
  stubFetch(() => Response.json({ message: "SHA does not match" }, { status: 409 }));
  const sha = "a".repeat(40);
  const response = await save(request("/api/admin/save", JSON.stringify({ section: "projects", data: projects, sha }), cookie));
  expect(response.status).toBe(409);
  expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  expect(globalThis.fetch).toHaveBeenCalledWith(
    expect.any(String), expect.objectContaining({ method: "PUT", body: expect.stringContaining(sha) }),
  );
});

test("production saves require a file revision", async () => {
  const cookie = await sessionCookie();
  Object.assign(process.env, { NODE_ENV: "production" });
  expect((await save(request("/api/admin/save", JSON.stringify({ section: "projects", data: projects }), cookie))).status).toBe(409);
  expect(globalThis.fetch).not.toHaveBeenCalled();
});

test("proxy protects admin pages while leaving login accessible", async () => {
  const cookie = await sessionCookie();
  const page = "https://portfolio.test/admin/projects";
  const redirect = proxy(new NextRequest(page));
  expect(redirect.status).toBe(307);
  expect(redirect.headers.get("location")).toContain("/admin/login?from=%2Fadmin%2Fprojects");
  expect(proxy(new NextRequest(page, { headers: { Cookie: cookie } })).status).toBe(200);
  expect(proxy(new NextRequest("https://portfolio.test/admin/login")).status).toBe(200);
});

test.each([
  { section: "profile", data: profile },
  { section: "experience", data: experience },
  { section: "education", data: education },
  { section: "projects", data: projects },
  { section: "skills", data: skills },
  { section: "leadership", data: leadership },
  { section: "certifications", data: certifications },
  { section: "languages", data: languages },
  { section: "site", data: site },
])("existing $section content satisfies the publishing schema", (entry) => {
  expect(AdminSaveRequestSchema.safeParse(entry).success).toBe(true);
});
