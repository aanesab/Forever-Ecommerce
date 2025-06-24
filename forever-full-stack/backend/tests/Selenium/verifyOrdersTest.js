import { Builder, By, until } from "selenium-webdriver";
import "chromedriver";


const runVerifyTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:5174/login");

    await driver.wait(until.elementLocated(By.css("input[type='email']")), 5000);
    await driver.wait(until.elementLocated(By.css("input[type='password']")), 5000);

    await driver.findElement(By.css("input[type='email']")).sendKeys("admin@example.com");
    await driver.findElement(By.css("input[type='password']")).sendKeys("greatstack123");

    await driver.findElement(By.css("button")).click();

    await driver.wait(until.elementLocated(By.css("div.mx-auto.text-gray-600")), 5000);

    await driver.get("http://localhost:5174/orders");

    await driver.wait(until.elementLocated(By.css("h3")), 5000);
    await driver.wait(until.elementLocated(By.css("div.border-2")), 5000);

    const orders = await driver.findElements(By.css("div.border-2"));
    if (orders.length === 0) {
      throw new Error("No orders found on the admin page");
    }

    console.log("Orders are present on the admin page");
    
  } catch (err) {
    console.error("Verify test failed:", err.message);
  } finally {
    await driver.quit();
  }
};

runVerifyTest();
