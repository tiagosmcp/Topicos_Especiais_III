async function getData() {
  const url = "https://effective-xylophone-jppggq7r7gvhq6qv-8080.app.github.dev/api/pessoas";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
}