const { Builder, By, until } = require("selenium-webdriver");
require("chromedriver");

const runListTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3000/product-list");
    await driver.wait(until.elementLocated(By.css('div.flex.flex-col')), 5000);

    const products = await driver.findElements(By.css('div.grid.grid-cols-\\[1fr_3fr_1fr\\]'));
    if (products.length === 0) {
      throw new Error("No products displayed in list");
    }

    const firstProduct = products[0];
    const deleteButton = await firstProduct.findElement(By.xpath('.//p[text()="X"]'));
    await deleteButton.click();

    await driver.wait(until.elementLocated(By.css('.Toastify__toast--success')), 5000);
    console.log("List test completed successfully");
  } catch (err) {
    console.error("List test failed:", err.message);
  } finally {
    await driver.quit();
  }
};

runListTest();