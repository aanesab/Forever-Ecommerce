import { Builder, By, until } from "selenium-webdriver";
import "chromedriver";

const runListTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
   await driver.get("http://localhost:5174/login");

  await driver.wait(until.elementLocated(By.css("input[type='email']")), 5000);
  await driver.wait(until.elementLocated(By.css("input[type='password']")), 5000);

  await driver.findElement(By.css("input[type='email']")).sendKeys("admin@example.com");
  await driver.findElement(By.css("input[type='password']")).sendKeys("greatstack123");

  await driver.findElement(By.css("button")).click();

  await driver.wait(until.elementLocated(By.css("div.mx-auto.text-gray-600")), 5000);

  await driver.get("http://localhost:5174/list");

  await driver.wait(until.elementLocated(By.css("div.flex.flex-col")), 5000);

  const products = await driver.findElements(
    By.css("div.grid.grid-cols-\\[1fr_3fr_1fr\\]")
  );
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