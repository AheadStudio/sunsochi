(function($) {
	var SUNSOCHI = (function() {

		var $sel = {};
		$sel.window = $(window);
		$sel.html = $("html");
		$sel.body = $("body", $sel.html);

		return {

			filter: {

				init: function() {
					var self = this;
					self.toggleTabs.init();
				},

				toggleTabs: {

					showEl: [],

					init: function() {
						var self = this,
							$filterItem = $("[data-filter-tab]");

						$filterItem.on("click", function(e) {
							var item = $(this),
								dataItem = item.data("filterTab"),
								$allItem = $(".filter-item[data-filter-item]"),
								$showItem;

							if (dataItem === "0") {
								self.hideAll($allItem);
								e.preventDefault();
								return;
							}
							$filterItem.removeClass("active-tab");

							setTimeout(function() {
								item.addClass("active-tab");
							}, 50);

							$showItem = $(".filter-item[data-filter-item *='"+dataItem+"']");

							self.show($showItem, $allItem);

						});

					},

					show: function(el, elements) {
						var self = this;

						elements.addClass("hide");
						setTimeout(function() {
							elements.addClass("hide-block");
							el.removeClass("hide-block");

							setTimeout(function() {
								el.removeClass("hide");
							},50);

						},300);

					},

					hideAll: function(elements) {
						var self = this;

						elements.addClass("hide");
						elements.addClass("hide-block");

					}

				},

				formFilter: {
					init: function() {
						var self = this;
					},
				},

			},

			forms: {

				init: function($form) {
					var self = this;

					if (!$form) {
						var $form = $sel.body;
					}

					self.applyJcf($form);
				},

				applyJcf: function($form) {
					var $selects = $("select", $form),
						$numbers = $("input[type=number]", $form),
						$checkbox = $("input[type=checkbox]", $form),
						$radio = $("input[type=radio]", $form),
						$range = $("input[type=range]", $form);

					$checkbox.each(function() {
						var $item = $(this);
						jcf.replace($item);
					});

					jcf.setOptions("Select", {
						wrapNative: false,
						wrapNativeOnMobile: true,
						multipleCompactStyle: true,
					});

					jcf.setOptions("Number", {
						pressInterval: "150",
						disabledClass: "jcf-disabled",
					});

					jcf.setOptions("Range", {
						orientation: "horizontal",
					});

					$selects.each(function() {
						var $select = $(this);
						if ($select.data("jcfapply") == "on") {
							jcf.replace($select);
						}
					});

					$numbers.each(function() {
						var $number = $(this);
						jcf.replace($number);
					});


					$radio.each(function() {
						var $item = $(this);
						jcf.replace($item);
					});

					$range.each(function() {
						var $item = $(this);
						jcf.replace($item);
					});

				},

			},

			modalWindow: {

				init: function() {
					var self = this;

					self.mfp.init()
				},

				mfp: {
					init: function() {
						$(".mfp-modal").magnificPopup({
							type: "inline",
							midClick: true,
							closeMarkup: '<button title="%title%" type="button" class="mfp-close regions-container-close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44.8 44.8"><g data-name="Слой 2"><path d="M19.6 22.4L0 42l2.8 2.8 19.6-19.6L42 44.8l2.8-2.8-19.6-19.6L44.8 2.8 42 0 22.4 19.6 2.8 0 0 2.8z" fill="#d0d0d0" data-name="Слой 1"/></g></svg></button>',
							mainClass: "mfp-fade",
							callbacks: {
								open: function() {
									$(".regions-container-close").on("click", function() {
										$.magnificPopup.close();
									});
								},
							}
						});
					}
				}

			}

		};

	})();

	SUNSOCHI.forms.init();
	SUNSOCHI.filter.init();
	SUNSOCHI.modalWindow.init();

})(jQuery);
