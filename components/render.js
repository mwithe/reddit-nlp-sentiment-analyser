function render(response) {
    // Initialize arrays to store items of different types
    const people = [];
    const overview = [];
    const posts = [];
  
    // Loop through the scanned items and categorize them based on the "type" attribute
    for (const item of response.Items) {
      const itemType = item.type.S;
  
      if (itemType === "person") {
        people.push(item);
      } else if (itemType === "Overview") {
        overview.push(item);
      } else if (itemType === "post") {
        posts.push(item);
      }
    }
  
    // Return the arrays as an object
    return { people, posts, overview };
  }

  module.exports = {
    render
  };
  