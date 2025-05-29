const { Builder, By, until } = require("selenium-webdriver");
require("chromedriver");

const runLatestCollectionTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3000");
    await driver.wait(until.elementLocated(By.css('.my-10')), 5000);

    const productItems = await driver.findElements(By.css('.grid.grid-cols-2 div'));
    if (productItems.length === 0) {
      throw new Error("No products displayed in latest collection");
    }

    if (productItems.length > 10) {
      throw new Error("More than 10 products displayed");
    }

    const firstProduct = productItems[0];
    await firstProduct.click();
    await driver.wait(until.urlContains("/product/"), 5000);

    console.log("Latest collection test completed successfully");
  } catch (err) {
    console.error("Latest collection test failed:", err.message);
  } finally {
    await driver.quit();
  }
};

runLatestCollectionTest();