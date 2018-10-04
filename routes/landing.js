
module.exports = function () {
  return {
    SetRouting: function (router) {
      router.get("/", this.landingPage); //i am using this keyword i have this function 

    },
    landingPage: function (req, res) {
      res.render("landing");
    },


  }
}
