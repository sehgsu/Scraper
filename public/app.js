$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i].id + "'>" + "<br><img ='" + data[i].image + "'><br>" + data[i].title + "<br />" + data[i].link + "</p>")
    }
});

// on click for scrape button, GETs information from the scrape and reloads page
$(document).on("click", "#scrapeBtn", function () {
  console.log("button works");
    
  $.ajax({
      method: "GET",
      url: "/scrape"
    })
      .then(function (data) {
        console.log("testingtesting")
        console.log(data);
      });
  });

// on click for P tags of articles to display notes
// $(document).on("click", "p", function() {
//     $("")
// })
