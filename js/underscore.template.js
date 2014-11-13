// integrate underscore string
_.mixin(_.str.exports());

// change underscore tempate syntax
_.templateSettings = {
    evaluate:    /<%([\s\S]+?)%>/g,          // <% console.log("blah") %>
    escape:      /\{\{[^\=]([\s\S]+?)\}\}/g, // {{ title }}
    interpolate: /\{\{\=([\s\S]+?)\}\}/g     // {{= html_content }}
};

// create a jQuery shortcut
$.render = function(templateSelector, data, settings) {
    var templateString = $(templateSelector).html();
    var template = _.template(templateString, settings);

    return $(template(data));
};

$.fn.render = function(templateSelector, data, settings) {
    var rendered = $.render(templateSelector, data, settings);
    var outerHtml = rendered.wrapAll('<div />').parent().html();

    return $(this).html(outerHtml);
};