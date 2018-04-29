async function runSafely(callback) {
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  while (!window.jQuery) sleep(50);
  
  try {
    callback();
  } catch (err) {
    console.log(err);
  }
}