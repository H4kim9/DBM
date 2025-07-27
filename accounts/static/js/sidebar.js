// Nested dropdown: Volume Kwh
$(".has-sub-kwh > a").click(function (e) {
    e.preventDefault();

    var $parent = $(this).parent();
    var $subMenu = $parent.find(".sub-kwh");

    $parent.toggleClass("active");
    $subMenu.slideToggle();

    $(".has-sub-kwh").not($parent).removeClass("active");
    $(".sub-kwh").not($subMenu).slideUp();
});
// Nested dropdown: Trafic
$(".has-sub-trafic > a").click(function (e) {
    e.preventDefault();

    var $parent = $(this).parent();
    var $subMenu = $parent.find(".sub-trafic");

    $parent.toggleClass("active");
    $subMenu.slideToggle();

    $(".has-sub-trafic").not($parent).removeClass("active");
    $(".sub-trafic").not($subMenu).slideUp();
});
// Main menu toggle (top-level)
$(".menu > ul > li > a").click(function (e) {
    var $sidebar = $(".sidebar");
    var $parent = $(this).parent();

    // Ignore click if it's already a sub-menu item
    if ($(this).closest("ul").hasClass("sub-menu")) return;

    if ($sidebar.hasClass("active")) {
        // Sidebar is collapsed — expand and show this dropdown only
        $sidebar.removeClass("active");
        $parent.addClass("active").find("ul").slideDown();
        e.preventDefault();
        return false;
    }

    // Toggle this dropdown
    $parent.toggleClass("active");
    $parent.find("ul").first().slideToggle();

    // Do not close other dropdowns; allow multiple to stay open
});

// Store indexes of active dropdowns before collapsing
var previouslyActiveDropdownIndexes = [];

$(".menu-btn").click(function () {
    var $sidebar = $(".sidebar");
    var $mainDropdowns = $(".menu > ul > li");
    var isCollapsed = $sidebar.hasClass("active");

    if (!isCollapsed) {
        // About to collapse: store indexes of active dropdowns
        previouslyActiveDropdownIndexes = [];
        $mainDropdowns.each(function(idx) {
            if ($(this).hasClass("active")) {
                previouslyActiveDropdownIndexes.push(idx);
            }
        });
    }

    $sidebar.toggleClass("active");
    isCollapsed = $sidebar.hasClass("active");

    if (isCollapsed) {
        // Hide all open dropdowns when collapsed
        $mainDropdowns.find("ul").slideUp();
        $(".sub-factorisation").slideUp();
    } else {
        // Restore previously active dropdowns
        $mainDropdowns.removeClass("active").find("ul").hide();
        previouslyActiveDropdownIndexes.forEach(function(idx) {
            var $li = $mainDropdowns.eq(idx);
            $li.addClass("active").find("ul").first().slideDown();
        });
    }
});

// Nested dropdown: Factorisation
$(".has-sub-factorisation > a").click(function (e) {
    e.preventDefault();

    var $parent = $(this).parent();
    var $subMenu = $parent.find(".sub-factorisation");

    $parent.toggleClass("active");
    $subMenu.slideToggle();

    $(".has-sub-factorisation").not($parent).removeClass("active");
    $(".sub-factorisation").not($subMenu).slideUp();
});

// Allow only one sub-menu item to be active in the whole sidebar
$(".sub-menu li a").click(function (e) {
    e.stopPropagation(); // Don't bubble up to parent
    // Remove active from all sub-menu items in the sidebar
    $(".sub-menu li").removeClass('active');
    // Add active to clicked item
    $(this).parent().addClass('active');
});
