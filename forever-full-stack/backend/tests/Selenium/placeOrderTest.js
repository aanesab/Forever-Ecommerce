import { Builder, By, until } from "selenium-webdriver";
import "chromedriver";

const runPlaceOrderTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:5173/login");
    await driver.wait(until.elementLocated(By.css("input[type='email']")), 5000);
    await driver.wait(until.elementLocated(By.css("input[type='password']")), 5000);

    await driver.findElement(By.css("input[type='email']")).sendKeys("sarabulliqi@gmail.com");
    await driver.findElement(By.css("input[type='password']")).sendKeys("sarasara123");

    await driver.findElement(By.css("button")).click();

    await driver.wait(until.urlIs("http://localhost:5173/"), 10000);

    await driver.get("http://localhost:5173/place-order");
    await driver.wait(until.elementLocated(By.css("form.flex")), 5000);

    await driver.findElement(By.name("firstName")).sendKeys("John");
    await driver.findElement(By.name("lastName")).sendKeys("Doe");
    await driver.findElement(By.name("email")).sendKeys("john.doe@example.com");
    await driver.findElement(By.name("street")).sendKeys("123 Main St");
    await driver.findElement(By.name("city")).sendKeys("New York");
    await driver.findElement(By.name("state")).sendKeys("NY");
    await driver.findElement(By.name("zipcode")).sendKeys("10001");
    await driver.findElement(By.name("country")).sendKeys("USA");
    await driver.findElement(By.name("phone")).sendKeys("1234567890");

    const codOption = await driver.findElement(By.xpath("//p[contains(text(), 'CASH ON DELIVERY')]/.."));
    await codOption.click();

    const placeOrderButton = await driver.findElement(By.xpath("//button[contains(text(), 'PLACE ORDER')]"));

    await driver.executeScript("arguments[0].scrollIntoView({block: 'center', inline: 'nearest'})", placeOrderButton);
    await driver.sleep(500);
    await driver.wait(until.elementIsVisible(placeOrderButton), 5000);
    await driver.wait(until.elementIsEnabled(placeOrderButton), 5000);

    await placeOrderButton.click();

    await driver.wait(until.urlIs("http://localhost:5173/orders"), 10000);

    console.log("Place order test completed successfully");
  } catch (err) {
    console.error("Place order test failed:", err.message);
  } finally {
    await driver.quit();
  }
};

runPlaceOrderTest();