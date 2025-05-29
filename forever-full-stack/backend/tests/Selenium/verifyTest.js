const { Builder, By, until } = require("selenium-webdriver");
require("chromedriver");

const runVerifyTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3000/verify?success=true&orderId=test_order_123");
    await driver.wait(until.urlIs("http://localhost:3000/orders"), 10000);
    console.log("Verify test completed successfully (success case)");

    const driver2 = await new Builder().forBrowser("chrome").build();
    try {
      await driver2.get("http://localhost:3000/verify?success=false&orderId=test_order_123");
      await driver2.wait(until.urlIs("http://localhost:3000/cart"), 10000);
      console.log("Verify test completed successfully (failure case)");
    } finally {
      await driver2.quit();
    }
  } catch (err) {
    console.error("Verify test failed:", err.message);
  } finally {
    await driver.quit();
  }
};

runVerifyTest();