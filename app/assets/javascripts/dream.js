var Dreams = function(){

  var cache = [];

  function Dream(id, text, newTheme) {
    this.id = id;
    this.text = text;
    this.newTheme = newTheme
  }

 Dream.prototype.save = function(theme){

    var that = this;

    $.post( "./dreams.json",
            {dream: { id: that.id, text: that.text },
             theme: { title: that.newTheme} },
           function(resp) {
              that.id = resp.id;
              Dream.all.push(that);

              for(var i = 0; i < Dream.callbacks.length; i++){
                Dream.callbacks[i]();
              }

            } );
  }

  Dream.all = [];
  Dream.callbacks = [];
  Theme.all = [];

  Dream.fetchAll = function () {
    $.getJSON(
      "/dreams.json",
      function (data) {
        Dream.all = [];
        Theme.all = [];

        for(var i = 0; i < data[0].length; i++){
          Dream.all.push(new Dream( data[0][i].id, data[0][i].text))
        }

        cache.push(Dream.all);

        for(var i = 0; i < data[1].length; i++){
          Theme.all.push(new Theme(data[1][i].id,
                                   data[1][i].title,
                                   data[1][i].dream_id))
        }

        cache.push(Theme.all)

        for(var i = 0; i < Dream.callbacks.length; i++ ){
          Dream.callbacks[i]();
        }


      });
    return [ Dream.all, Theme.all ];
  };

  Dream.prototype.getThemes = function () {
    var that = this;
    var arr = []

    for (var i = 0; i < Theme.all.length; i++ ){
      //camel case
      if (Theme.all[i].dream_id === that.id){
        arr.push( Theme.all[i]);
      }
    }

    return arr;
  }

  function Theme(id, title, dream_id){
    this.id = id;
    this.title = title;
    this.dream_id = dream_id;
    //camel case
  }

  function DreamIndexView(el, dreamForm) {
    var that = this;
    that.$el = $(el);
    Dream.callbacks.push( function () { that.render(); })
  }

  DreamIndexView.prototype.render = function(){
    var ul = $("<ul></ul>");
    var themes;


    for(var i = 0; i < Dream.all.length; i ++){

      themes = Dream.all[i].getThemes();
      var li = $("<li></li>").text(Dream.all[i].text + Dream.all[i].id);

      if(themes.length){
        var dreamUl = $("<ul></ul>");
        for(var j = 0; j < themes.length; j++){
          dreamUl.append( $("<li></li>").text(themes[j].title +themes[j].id ) );
        }
        li.append(dreamUl)
      }

      ul.append(li);
    }

    this.$el.html(ul);
  }

  function DreamFormView(textField,
                         themeField,
                         submitButton,
                         refreshButton,
                         callback
                        ) {
    var that = this;
    Dream.callbacks.push( function () { that.render(); })

    this.$textField = $(textField);
    this.$themeField = $(themeField);
    this.$refreshButton = $(refreshButton);
    this.$submitButton = $(submitButton);
    this.callback = callback;

  }

  DreamFormView.prototype.render = function() {
    console.log("Dream render");
    var $ol = $("<ol></ol>");
    var $els = $("ul li ul li");
    console.log(this.$themeField.val());
    var regex = new RegExp("^" + this.$themeField.val());
    $els = $els.filter(function(){ return $(this).text().match(regex)})

    for(var i = 0; i < 3; i++){
      $ol.append($els.eq(i).clone());
    }
    $("#dream-form ol").remove();
    $("#dream-form").append($ol);

  }

  DreamFormView.prototype.bind = function () {
    var that = this;

    that.submitClickHandler = function () {
      that.$submitButton.attr("disabled", true);
      that.submit();
      that.$submitButton.attr("disabled", false);
    }

    that.refreshClickHandler = function () {
      that.refresh();
    }

    that.themeFieldHandler = function (){
      console.log(that.$themeField.val());
      that.render();
    }

    that.$refreshButton.click(that.refreshClickHandler);
    that.$submitButton.click(that.submitClickHandler);
    that.$themeField.keyup(that.themeFieldHandler);
  }

  DreamFormView.prototype.unbind = function () {
    var that = this;

    that.$submitButton.off("click", submitButtonClickHandler);
    delete that.submitClickHandler;
  }

  DreamFormView.prototype.submit = function () {
    var that = this;

    var newDream = new Dream(null, that.$textField.val(),
                             that.$themeField.val());

    that.$themeField.val("");
    that.$textField.val("");
    that.callback(newDream);
    Dream.fetchAll();
  }

  DreamFormView.prototype.refresh = function () {
    Dream.fetchAll();
  }

  return {
    Dream: Dream,
    Theme: Theme,
    DreamIndexView: DreamIndexView,
    DreamFormView: DreamFormView,
    cache: cache
  };
}();