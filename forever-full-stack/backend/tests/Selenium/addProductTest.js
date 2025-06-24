import { Builder, By, until } from "selenium-webdriver";
import "chromedriver";

const runAddProductTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
     await driver.get("http://localhost:5174/login");

    await driver.wait(until.elementLocated(By.css("input[type='email']")), 5000);
    await driver.wait(until.elementLocated(By.css("input[type='password']")), 5000);

    await driver.findElement(By.css("input[type='email']")).sendKeys("admin@example.com");
    await driver.findElement(By.css("input[type='password']")).sendKeys("greatstack123");

    await driver.findElement(By.css("button")).click();

    await driver.wait(until.elementLocated(By.css("div.mx-auto.text-gray-600")), 5000);

    await driver.get("http://localhost:5174/add");
    await driver.wait(until.elementLocated(By.css("form.flex")), 5000);

    await driver.findElement(By.css('input[placeholder="Type here"]')).sendKeys("Test Product");
    await driver.findElement(By.css('textarea[placeholder="Write content here"]')).sendKeys("Test Description");

    const categorySelect = await driver.findElement(By.css("select"));
    await categorySelect.findElement(By.css('option[value="Women"]')).click();

    const subCategorySelect = await driver.findElement(By.xpath("(//select)[2]"));
    await subCategorySelect.findElement(By.css('option[value="Bottomwear"]')).click();

    await driver.findElement(By.css('input[type="Number"]')).sendKeys("99");

    await driver.findElement(By.xpath('//p[text()="M"]')).click();
    await driver.findElement(By.xpath('//p[text()="XL"]')).click();

    await driver.findElement(By.id("bestseller")).click();

    await driver.findElement(By.xpath('//button[text()="ADD"]')).click();

    await driver.wait(until.elementLocated(By.css(".Toastify__toast--success")), 5000);
    console.log("Add product test completed successfully");
  } catch (err) {
    console.error("Add product test failed:", err.message);
  } finally {
    await driver.quit();
  }
};

runAddProductTest();