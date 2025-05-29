const { Builder, By, until } = require("selenium-webdriver");
require("chromedriver");

const runBestSellerTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3000");
    await driver.wait(until.elementLocated(By.css('.my-10')), 5000);

    const bestSellerItems = await driver.findElements(By.css('.grid.grid-cols-2 div'));
    if (bestSellerItems.length === 0) {
      throw new Error("No best seller products displayed");
    }

    if (bestSellerItems.length > 5) {
      throw new Error("More than 5 best seller products displayed");
    }

    const firstBestSeller = bestSellerItems[0];
    await firstBestSeller.click();
    await driver.wait(until.urlContains("/product/"), 5000);

    console.log("Best seller test completed successfully");
  } catch (err) {
    console.error("Best seller test failed:", err.message);
  } finally {
    await driver.quit();
  }
};

runBestSellerTest();