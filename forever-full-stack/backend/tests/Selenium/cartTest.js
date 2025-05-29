const { Builder, By, until } = require("selenium-webdriver");
require("chromedriver");

const runCartTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3000/cart");
    await driver.wait(until.elementLocated(By.css('.border-t.pt-14')), 5000);

    const cartItems = await driver.findElements(By.css('.grid.grid-cols-\\[4fr_0\\.5fr_0\\.5fr\\]'));
    if (cartItems.length === 0) {
      throw new Error("No cart items are displayed");
    }

    const firstItemQuantity = await driver.findElement(By.css('input[type="number"]'));
    await firstItemQuantity.clear();
    await firstItemQuantity.sendKeys("2");

    const deleteButtons = await driver.findElements(By.css('img[src*="bin_icon"]'));
    if (deleteButtons.length > 0) {
      await deleteButtons[0].click();
    }

    const proceedButton = await driver.findElement(By.xpath("//button[contains(text(), 'PROCEED TO CHECKOUT')]"));
    await proceedButton.click();
    await driver.wait(until.urlIs("http://localhost:3000/place-order"), 5000);

    console.log("Cart page test completed successfully");
  } catch (err) {
    console.error("Cart page test failed:", err.message);
  } finally {
    await driver.quit();
  }
};

runCartTest();