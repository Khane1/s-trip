
module.exports = function () {
  return {
    SetRouting: function (router) {
      router.get("/travel", this.travelPage);

    },
    travelPage: function (req, res) {
      res.render("travel/index");
    }
  }
}
