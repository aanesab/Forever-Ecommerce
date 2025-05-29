const { Builder, By, until } = require("selenium-webdriver");
require("chromedriver");

const runLoginTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3000/login");
    await driver.wait(until.elementLocated(By.css("input[type='email']")), 5000);

    await driver.wait(until.elementLocated(By.css("input[type='password']")), 5000);

    await driver.findElement(By.css("input[type='email']")).sendKeys("testuser@example.com");

    await driver.findElement(By.css("input[type='password']")).sendKeys("testpassword123");
    
    await driver.findElement(By.css("button")).click();
    await driver.wait(until.urlIs("http://localhost:3000/"), 5000);
    console.log("Login Test completed.");
  } catch (err) {
    console.error("Login Test failed:", err.message);
  } finally {
    await driver.quit();
  }
};

runLoginTest();