import { Builder, By, until } from "selenium-webdriver";
import "chromedriver";

const runProductPageTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:5173/product/685a7a5c99ffd421d203e83e");

    await driver.wait(until.elementLocated(By.css(".border-t-2.pt-10")), 5000);

    const productName = await driver.findElement(By.css("h1.font-medium.text-2xl")).getText();
    if (!productName || productName.length === 0) {
      throw new Error("Product name not found or empty");
    }

    const priceElement = await driver.findElement(By.css(".text-3xl.font-medium"));
    const priceText = await priceElement.getText();
    if (!priceText.match(/^\s*[$€£]/)) {
      throw new Error("Price doesn't have a valid currency symbol");
    }

    const thumbnails = await driver.findElements(By.css(".flex-shrink-0.cursor-pointer"));
    if (thumbnails.length > 0) {
      await thumbnails[0].click();
      await driver.findElement(By.css(".w-full.h-auto"));
    }

    const sizeButtons = await driver.findElements(By.css(".border.py-2.px-4.bg-gray-100"));
    if (sizeButtons.length > 0) {
      await sizeButtons[0].click();
      const selectedClass = await sizeButtons[0].getAttribute("class");
      if (!selectedClass.includes("border-orange-500")) {
        throw new Error("Size selection not visually confirmed");
      }
    }
    await driver.sleep(1000);

    const descriptionSection = await driver.findElement(By.css(".border.px-6.py-6"));
    const descriptionText = await descriptionSection.getText();
    if (!descriptionText || descriptionText.length < 10) {
      throw new Error("Description text is missing or too short");
    }

    console.log("Product page test completed successfully");
  } catch (err) {
    console.error("Product page test failed:", err.message);
  } finally {
    await driver.quit();
  }
};

runProductPageTest();
