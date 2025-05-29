const { Builder, By, until } = require("selenium-webdriver");
require("chromedriver");

const runProductPageTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3000/product/some-product-id");
    await driver.wait(until.elementLocated(By.css('.border-t-2.pt-10')), 5000);

    const productName = await driver.findElement(By.css('h1.font-medium.text-2xl')).getText();
    const priceElement = await driver.findElement(By.css('.text-3xl.font-medium'));
    const priceText = await priceElement.getText();

    if (!priceText.startsWith('$') && !priceText.startsWith('€') && !priceText.startsWith('£')) {
      throw new Error("Price doesn't have currency symbol");
    }

    const thumbnails = await driver.findElements(By.css('.flex-shrink-0.cursor-pointer'));
    if (thumbnails.length > 0) {
      await thumbnails[0].click();
      const mainImage = await driver.findElement(By.css('.w-full.h-auto'));
      await mainImage.getAttribute('src');
    }

    const sizeButtons = await driver.findElements(By.css('.border.py-2.px-4.bg-gray-100'));
    if (sizeButtons.length > 0) {
      await sizeButtons[0].click();
      const selectedSizeClass = await sizeButtons[0].getAttribute('class');
      if (!selectedSizeClass.includes('border-orange-500')) {
        throw new Error("Size selection feedback not working");
      }
    }

    const addToCartButton = await driver.findElement(By.css('.bg-black.text-white'));
    await addToCartButton.click();

    const descriptionTab = await driver.findElement(By.xpath("//b[contains(text(), 'Description')]"));
    await descriptionTab.click();
    await driver.findElement(By.css('.border.px-6.py-6')).getText();

    console.log("Product page test completed successfully");
  } catch (err) {
    console.error("Product page test failed:", err.message);
  } finally {
    await driver.quit();
  }
};

runProductPageTest();