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

					self.formFilter.init();
				},

				toggleTabs: {

					showEl: [],

					forms: "",

					init: function() {
						var self = this,
							$filterItem = $("[data-filter-tab]");

						self.forms = $(".form-filter");

						$filterItem.on("click", function(e) {
							var item = $(this),
								dataItem = item.data("filterTab"),
								$allItem = $(".filter-item[data-filter-item]"),
								$showItem;

							if (dataItem === 0) {
								self.hideAll($allItem);

								item.removeClass("active");

								self.forms.each(function() {
									var $form = $(this),
										$itemForm = $form.find(".form-item");

									$form[0].reset();

									$itemForm.each(function() {
										(function(el) {
											jcf.refresh(el);
										})($(this));
									})
								});
								event.preventDefault();
							}
							$filterItem.removeClass("active-tab");

							setTimeout(function() {
								item.addClass("active-tab");
							}, 50);

							$showItem = $(".filter-item[data-filter-item *='"+dataItem+"']");

							self.show($showItem, $allItem);

						});

						$filterItem.each(function() {
							var el = $(this),
								dataItem = el.data("filterTab"),
								itemfilter = $(".filter-item[data-filter-item *='"+dataItem+"']");

							if (!itemfilter.hasClass("hide")) {
								el.addClass("active-tab");
							}
						})

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

					filter: "",

					init: function() {
						var self = this;

						self.filter = $(".filter");

						self.changeRange();
						self.regions.init();
						self.watchChangeInput();
					},

					changeRange: function() {
						var self = this,
							$rangeInput = $("input[type=range]");

						$rangeInput.each(function() {

							(function(el) {
								var inputEl = $(el),
									jcfContainer = inputEl.closest(".jcf-range"),
									jcfFrom = jcfContainer.find(".jcf-index-1"),
									jcfFromField = $(".jcf-range-count-number", jcfFrom),
									jcfTo = jcfContainer.find(".jcf-index-2"),
									jcfToField = $(".jcf-range-count-number", jcfTo),
									fromVal,toVal,valueArray;

								valueArray = inputEl[0].defaultValue.split(",");

								// text in container
								jcfFromField.text(valueArray[0] + " м").append("<sup>2</sup>");
								jcfToField.text(valueArray[1] + " м").append("<sup>2</sup>");

								inputEl.attr("data-valfrom", valueArray[0]);
								inputEl.attr("data-valto", valueArray[1]);

								inputEl.on("change input", function(e) {
									var element = $(this);

									fromVal = element[0].valueLow;
									jcfFromField.text(fromVal + " м").append("<sup>2</sup>");

									toVal = element[0].valueHigh;
									jcfToField.text(toVal + " м").append("<sup>2</sup>");

									element.attr("data-valfrom", fromVal);
									element.attr("data-valto", toVal);
								});

							})($(this));

						});

					},

					watchChangeInput: function() {
						var self = this,
							$formItem = $(".form-item", ".form-filter");

						$formItem.each(function() {
							var $el = $(this);

							$el.on("change input", function(e) {
								var $btnClear = self.filter.find(".filter-clear");
								$btnClear.addClass("active");
							});
						})

					},

					regions: {

						init: function() {
							var self = this;

							self.selectRegions();
						},

						selectRegions: function() {
							var self = this;
								$regionsList = $(".regions-container-list ul");

							$regionsList.each(function() {
								var $region = $(this),
									$container = $region.closest(".filter-item");
									$elements = $region.find("li"),
									$closeCheckbox = $elements.find(".regions-close");

								$elements.on("click", function() {
									var $el = $(this),
										text = $el.find(".regions-text").text(),
										name = $el.attr("name");

									if (!$el.hasClass("select")) {
										$el.addClass("select");
										self.addCheckbox($container, text, name);
									}

								});

								$closeCheckbox.on("click", function() {
									var $el = $(this).closest("li"),
										name = $el.attr("name"),
										$checkboxRemove;

									if ($el.hasClass("select")) {
										$checkboxRemove = $container.find(".filter-selected-regions-item[data-regname='"+name+"']");

										$el.removeClass("select");
										$checkboxRemove.remove();

										event.stopPropagation();
									}
								});

							})
						},

						addCheckbox: function(filterContainer, textCheckbox, nameCheckbox) {
							var self = this,
								checkboxContainer = filterContainer.find(".filter-selected-regions-list");

							checkboxContainer.append(
								'<div class="filter-selected-regions-item" data-regname="'+nameCheckbox+'">'+
                      				'<input type="checkbox" name="'+nameCheckbox+'" data-jcfapply="off" disabled="" checked="checked" class="form-item form-item--checkbox"><span class="selected-regions-item-text">'+textCheckbox+'</span>'+
                  					'<div class="selected-regions-item-close">'+
										'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44.8 44.8"><g id="Слой_2" data-name="Слой 2"><g id="Слой_1-2" data-name="Слой 1"><path d="M19.6,22.4,0,42l2.8,2.8L22.4,25.2,42,44.8,44.8,42,25.2,22.4,44.8,2.8,42,0,22.4,19.6,2.8,0,0,2.8Z" fill="#d0d0d0"></path></g></g></svg>'+
									'</div>'+
                    			'</div>');

							self.removeCheckbox();

						},

						removeCheckbox: function(el) {
							var self = this,
								$buttonRemove = $(".selected-regions-item-close", ".filter-selected-regions-item");

							$buttonRemove.on("click", function() {
								var $el = $(this),
									$removeContainer = $el.closest(".filter-selected-regions-item"),
									$regionElement = $removeContainer.closest(".filter-item").find("li[name='"+$removeContainer.data("regname")+"']");
								$regionElement.removeClass("select");
								$removeContainer.remove();
							})

						},
					}
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
						if ($item.data("jcfapply") !== "off") {
							jcf.replace($item);
						}
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
						if ($select.data("jcfapply") !== "off") {
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
								open: function(el) {
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
