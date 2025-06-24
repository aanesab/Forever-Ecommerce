import { Builder, By, until } from "selenium-webdriver";
import "chromedriver";

const runCollectionTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:5173/collection"); 
    await driver.wait(until.elementLocated(By.css(".flex.flex-col.sm\\:flex-row")), 5000);

    const filterButton = await driver.findElement(By.xpath("//p[contains(text(), 'FILTERS')]"));
    await filterButton.click();

    const menCheckbox = await driver.findElement(By.css('input[value="Men"]'));
    await menCheckbox.click();

    const womenCheckbox = await driver.findElement(By.css('input[value="Women"]'));
    await womenCheckbox.click();

    const topwearCheckbox = await driver.findElement(By.css('input[value="Topwear"]'));
    await topwearCheckbox.click();

    const sortDropdown = await driver.findElement(By.css("select.border-2"));
    await sortDropdown.click();

    const lowToHighOption = await driver.findElement(By.css('option[value="low-high"]'));
    await lowToHighOption.click();

    const productsGrid = await driver.findElements(By.css(".grid.grid-cols-2 div"));
    if (productsGrid.length === 0) {
      throw new Error("No products displayed after filtering");
    }

    console.log("Collection page test completed successfully");
  } catch (err) {
    console.error("Collection page test failed:", err.message);
  } finally {
    await driver.quit();
  }
};

runCollectionTest();
