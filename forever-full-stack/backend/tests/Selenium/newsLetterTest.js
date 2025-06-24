import { Builder, By, until } from "selenium-webdriver";
import "chromedriver";

const runNewsletterTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:5173");

    await driver.wait(until.elementLocated(By.css(".text-center")), 5000);

    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    await emailInput.sendKeys("test@example.com");

    const subscribeButton = await driver.findElement(By.xpath("//button[contains(text(), 'SUBSCRIBE')]"));

    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'instant', block: 'center'})", subscribeButton);
    
    await driver.sleep(500);

    await subscribeButton.click();
    console.log("Newsletter test completed successfully");
  } catch (err) {
    console.error("Newsletter test failed:", err.message);
  } finally {
    await driver.quit();
  }
};

runNewsletterTest();
