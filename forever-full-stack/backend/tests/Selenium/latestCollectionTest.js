import { Builder, By, until } from "selenium-webdriver";
import "chromedriver";

const runLatestCollectionTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:5173");

    await driver.wait(until.elementLocated(By.css(".my-10")), 5000);

    const productGrid = await driver.findElement(By.css(".grid.grid-cols-2"));
    const items = await productGrid.findElements(By.css("div"));

    if (items.length === 0) {
      throw new Error("No products displayed in latest collection");
    }

    console.log("Latest collection test completed successfully");
  } catch (err) {
    console.error("Latest collection test failed:", err.message);
  } finally {
    await driver.quit();
  }
};

runLatestCollectionTest();