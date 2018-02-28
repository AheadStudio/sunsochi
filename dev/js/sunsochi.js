(function($) {
	var SUNSOCHI = (function() {

		var $sel = {};
		$sel.window = $(window);
		$sel.html = $("html");
		$sel.body = $("body", $sel.html);

		return {
			common: {
				go: function(topPos, speed, callback) {
					var curTopPos = $sel.window.scrollTop(),
						diffTopPos = Math.abs(topPos - curTopPos);
					$sel.body.add($sel.html).animate({
						"scrollTop": topPos
					}, speed, function() {
						if(callback) {
							callback();
						}
					});
				}
			},

			header: {
				init: function() {
					var self = this;

					self.scroll.init();
				},
				scroll: {
					init: function() {
						$sel.window.on("scroll", function() {
							var hh = $(".page-header").outerHeight(),
								sTop = $sel.window.scrollTop();
							if(sTop > hh+50) {
								$sel.body.addClass("fixed-header");
								setTimeout(function() {
									$sel.body.addClass("fixed-header--show");
								}, 100);
							} else {
								$sel.body.removeClass("fixed-header--show");
								$sel.body.removeClass("fixed-header");
							}
						});
					}
				},
			},

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

						$filterItem.on("click", function(e) {
							var item = $(this),
								dataItem = item.data("filterTab"),
								$allItem = $(".filter-item[data-filter-item]"),
								$showItem;

							if (dataItem === 0) {
								self.hideAll($allItem);
								item.removeClass("active");
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

					forms: "",

					init: function() {
						var self = this;

						self.filter = $(".filter");
						self.forms = $(".form-filter");

						self.changeRange();
						self.regions.init();
						self.watchChangeInput();
						self.resetFilter();
					},

					changeRange: function() {
						var self = this,
							$rangeInput = $("input[type=range]");

						$rangeInput.each(function() {

							(function(el) {
								var $inputEl = $(el),
									$jcfContainer = $inputEl.closest(".jcf-range"),
									jcfFrom = $jcfContainer.find(".jcf-index-1"),
									$jcfFromField = $(".jcf-range-count-number", jcfFrom),
									$jcfTo = $jcfContainer.find(".jcf-index-2"),
									$jcfToField = $(".jcf-range-count-number", $jcfTo),
									tplText = $inputEl.data("valtext"),
									fromVal,toVal,valueArray;

								valueArray = $inputEl[0].defaultValue.split(",");

								// text in container
								$jcfFromField.text(valueArray[0]).append(tplText);
								$jcfToField.text(valueArray[1]).append(tplText);

								$inputEl.attr("data-valfrom", valueArray[0]);
								$inputEl.attr("data-valto", valueArray[1]);

								$inputEl.on("change input", function(e) {
									var $element = $(this);
									fromVal = $element[0].valueLow;
									toVal = $element[0].valueHigh;

									$jcfFromField.text(fromVal).append(tplText);
									$jcfToField.text(toVal).append(tplText);

									$element.attr("data-valfrom", fromVal);
									$element.attr("data-valto", toVal);

									var currentStateRange = jcf.getInstance($inputEl);
									currentStateRange.refresh();

									self.positionTextTrueRange($element);
								});

							})($(this));

						});

					},

					positionTextTrueRange: function(trueElem) {
						var self = this,
							$jcfContainer = trueElem.closest(".jcf-range"),
							$minRange = $jcfContainer.find(".jcf-index-1"),
							$maxRange = $jcfContainer.find(".jcf-index-2"),
							$textLeft = $minRange.find(".jcf-range-count-number"),
							$textRight = $maxRange.find(".jcf-range-count-number");

						if ($minRange.position().left < 10 ) {
							$textLeft.addClass("left");
						} else {
							$textLeft.removeClass("left");
						}

						if ($maxRange.position().left > ($jcfContainer.width() - 20) || $maxRange.position().left === 0) {
							$textRight.addClass("right");
						} else {
							$textRight.removeClass("right");
						}
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

					},

					resetFilter: function() {
						var self = this,
							$clearFilter = $(".filter-clear", self.filter);

						$clearFilter.on("click", function() {
							var $regionsLi = $("li.select", ".regions-container");
							var $regionsCheckbox = $(".filter-selected-regions-item");

							$regionsLi.removeClass("select");
							$regionsCheckbox.remove();

							self.forms.each(function() {
								var $form = $(this),
									$itemForm = $form.find(".form-item");

								$form[0].reset();
								setTimeout(function() {
									$itemForm.each(function() {
										(function(el) {

											if (el.hasClass("form-item--range")) {
												var currentStateRange = jcf.getInstance(el);
												currentStateRange.values = [currentStateRange.minValue, currentStateRange.maxValue];
												currentStateRange.refresh();
												self.positionTextTrueRange(el);
											}
											jcf.refresh(el);
										})($(this));
									})
								}, 100);
							});
						});



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
					self.mask($form);
				},

				mask: function($form) {
					$("[data-number]", $form).each(function() {
						var $item = $(this);
						$item.mask($item.data("number"));
					});
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
							removalDelay: 300,
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

			},

			maps: {
				init: function() {
					$(".map", $sel.body).each(function() {
						var $map = $(this),
							lng = parseFloat($map.data("lng"), 10) || 0,
							lat = parseFloat($map.data("lat"), 10) || 0,
							zoom = parseInt($map.data("zoom"));

						var options = {
							center: new google.maps.LatLng(lat, lng),
							zoom: zoom,
							mapTypeControl: false,
							panControl: false,
							zoomControl: true,
							zoomControlOptions: {
								style: google.maps.ZoomControlStyle.LARGE,
								position: google.maps.ControlPosition.TOP_RIGHT
							},
							scaleControl: true,
							streetViewControl: true,
							streetViewControlOptions: {
								position: google.maps.ControlPosition.TOP_RIGHT
							},
							mapTypeId: google.maps.MapTypeId.ROADMAP,
							/*styles: [
								{"featureType": "landscape", "stylers": [
									{"saturation": -100},
									{"lightness": 0},
									{"visibility": "on"}
								]},
								{"featureType": "poi", "stylers": [
									{"saturation": -300},
									{"lightness": -10},
									{"visibility": "simplified"}
								]},
								{"featureType": "road.highway", "stylers": [
									{"saturation": -100},
									{"visibility": "simplified"}
								]},
								{"featureType": "road.arterial", "stylers": [
									{"saturation": -100},
									{"lightness": 0},
									{"visibility": "on"}
								]},
								{"featureType": "road.local", "stylers": [
									{"saturation": -100},
									{"lightness": 0},
									{"visibility": "on"}
								]},
								{"featureType": "transit", "stylers": [
									{"saturation": -100},
									{"visibility": "simplified"}
								]},
								{"featureType": "administrative.province", "stylers": [
									{"visibility": "off"}
								]},
								{"featureType": "water", "elementType": "labels", "stylers": [
									{"visibility": "on"},
									{"lightness": -25},
									{"saturation": -100}
								]},
								{"featureType": "water", "elementType": "geometry", "stylers": [
									{"hue": "#ffff00"},
									{"lightness": -25},
									{"saturation": -97}
								]}
							]*/
						};

						var iconMap= {
							url: $map.data("icon"),
							size: new google.maps.Size(45, 65),
						};
						var api = new google.maps.Map($map[0], options);
						var point = new google.maps.Marker({
							position: new google.maps.LatLng(lat, lng),
							map: api,
							icon: $map.data("icon")
						});

					});
				}
			},

			sliders: {

				init: function() {
					var self = this;

					self.owlCarousel();
				},

				owlCarousel:function() {
					var self = this,
						owlSlider = $('.owl-carousel');

					$('.owl-carousel').owlCarousel({
						margin: 10,
						loop: false,
						items: 1,
						dots: true,
						smartSpeed: 1000,
					})

				}

			},

			ajaxLoader: function() {
				$sel.body.on("click", ".load-more", function(event) {
					var $linkAddress = $(this),
						href = $linkAddress.attr("href"),
						selector = $linkAddress.data("itemsselector"),
						$container = $($linkAddress.data("container"));

					$linkAddress.addClass("loading");

					(function(href, $container, $link, selector) {
						$.ajax({
							url: href,
							success: function(data) {
								var $data = $('<div />').append(data),
									$items = $data.find(selector),
									$preloader = $data.find(".load");

								$items.addClass("load-events-item");
								$container.append($items);
								$link.parent().remove();

								if($preloader && $preloader.length) {
									$container.parent().append($preloader);
								}

								setTimeout(function() {
									$container.find(".load-events-item").removeClass("load-events-item");
									$linkAddress.removeClass("loading");
								}, 100);

							}
						})
					})(href, $container, $linkAddress, selector);
					event.preventDefault();
				})
			},

		};

	})();

	SUNSOCHI.header.init();
	SUNSOCHI.forms.init();
	SUNSOCHI.filter.init();
	SUNSOCHI.maps.init();
	SUNSOCHI.sliders.init();
	SUNSOCHI.modalWindow.init();
	SUNSOCHI.ajaxLoader();

})(jQuery);
