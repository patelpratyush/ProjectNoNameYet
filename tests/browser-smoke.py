import re

from playwright.sync_api import expect, sync_playwright


BASE_URL = "http://127.0.0.1:3000"


def main() -> None:
    page_errors: list[str] = []
    console_errors: list[str] = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        page.on("pageerror", lambda error: page_errors.append(str(error)))
        page.on(
            "console",
            lambda message: console_errors.append(message.text)
            if message.type == "error"
            else None,
        )

        response = page.goto(BASE_URL, wait_until="networkidle")
        assert response is not None and response.ok
        expect(page.get_by_role("heading", name=re.compile("Know where your money goes"))).to_be_visible()

        response = page.goto(f"{BASE_URL}/features", wait_until="networkidle")
        assert response is not None and response.ok
        expect(page.get_by_role("heading", name="Every tool your money needs")).to_be_visible()

        response = page.goto(f"{BASE_URL}/sign-in", wait_until="networkidle")
        assert response is not None and response.ok
        expect(page.get_by_role("heading", name="Sign in to FinPilot")).to_be_visible()

        page.goto(f"{BASE_URL}/app", wait_until="domcontentloaded")
        page.wait_for_url("**/app/dashboard")
        page.wait_for_load_state("networkidle")
        expect(page.get_by_role("heading", name=re.compile("Pratyush"))).to_be_visible()
        page.get_by_role("button", name="Theme: system. Switch to light.").click()
        page.wait_for_function("localStorage.getItem('finpilot-store-v1') !== null")

        page.locator("aside").get_by_role("link", name="Accounts").click()
        page.wait_for_url("**/app/accounts")
        expect(page.get_by_role("heading", name="Accounts")).to_be_visible()

        page.goto(f"{BASE_URL}/app/accounts?add=1", wait_until="networkidle")
        expect(page.get_by_role("dialog").get_by_role("heading", name="Add account")).to_be_visible()
        expect(page).to_have_url(re.compile(r"/app/accounts$"))
        page.keyboard.press("Escape")

        page.goto(f"{BASE_URL}/app/accounts/acc_checking", wait_until="networkidle")
        expect(page.get_by_role("heading", name="Chase Checking")).to_be_visible()

        page.goto(f"{BASE_URL}/app/stocks/AAPL", wait_until="networkidle")
        expect(page.get_by_role("heading", name="AAPL — Apple Inc.")).to_be_visible()

        page.goto(f"{BASE_URL}/app/goals/goal_emergency", wait_until="networkidle")
        expect(page.get_by_role("heading", name="Emergency Fund")).to_be_visible()

        page.goto(f"{BASE_URL}/app/settings", wait_until="domcontentloaded")
        page.wait_for_url("**/app/settings/profile")
        page.wait_for_load_state("networkidle")
        expect(page.get_by_role("heading", name="Settings")).to_be_visible()

        assert page_errors == [], f"Browser page errors: {page_errors}"
        assert console_errors == [], f"Browser console errors: {console_errors}"

        response = page.goto(f"{BASE_URL}/does-not-exist", wait_until="networkidle")
        assert response is not None and response.status == 404
        expect(page.get_by_role("heading", name="Page not found")).to_be_visible()

        browser.close()

    print("Browser smoke test passed: redirects, navigation, query state, dynamic routes, persistence, and 404")


if __name__ == "__main__":
    main()
