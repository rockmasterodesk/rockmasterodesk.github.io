"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
JSON Form Builder
Author: A.S.M. Asaduzzaman (https://www.upwork.com/freelancers/~0183d400d9b82308ef)
*/
var JsonFormBuilder =
/*#__PURE__*/
function () {
  // this.JsonData = The data as JSON
  // this.StringData = The data as String
  // this.data = The Formatted Data

  /*
    Pipeline:-
    -> JsonData (User provides)
    // -> Formatted Data (We format this data and store)
    -> Build Form (Build the form from Formatted Data)
    // -> Update Formatted Data (All DOM changes will be reflected to Formatted Data)
    -> Generate JsonData (Export: We generate JSON from formatted Data)
  */
  function JsonFormBuilder(json_data) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, JsonFormBuilder);

    if ("string" === typeof json_data) {
      this.StringData = json_data;
      this.JsonData = JSON.parse(json_data);
    } else if ("object" === _typeof(json_data)) {
      this.JsonData = json_data;
    } // Set Table Columns


    this.$columns = ["#", "Image", "SKU", "Cost", "Shipping", "Price", "Profit", "Compared At Price", "Inventory"]; // Configuration Options

    this.config = {};
    this.config.initialCounts = {};
    this.config.table = undefined !== options.table ? options.table : ".jfb-table";
    this.config.selectors = undefined !== options.selectors ? options.selectors : ".jfb-selector-nav";
    this.config.jQuery = undefined !== options.jQuery ? options.jQuery : window.jQuery;
    this.config.changeShippingFunction = undefined !== options.changeShippingFunction ? options.changeShippingFunction : function (callback) {
      callback(0, "", "");
    };
    this.config.shipping = undefined !== options.shippingOptions ? options.shippingOptions : {};
    this.config.price_cents = undefined !== options.price_cents ? options.price_cents : null;
    this.config.price_compare_cents = undefined !== options.price_compare_cents ? options.price_compare_cents : null;
    window.SHIPPING_INFO = this.config.shipping; // this.config.shipping.country = null;
    // this.config.shipping.option = null;
    // this.config.shipping.price = null;
    // Validate required options

    var required_fields = ["price_multiplier", "price_multiplier_mode", "compare_multiplier", "compare_multiplier_mode"];

    for (var _i = 0, _required_fields = required_fields; _i < _required_fields.length; _i++) {
      var field = _required_fields[_i];

      if (undefined === options[field]) {
        console.error("Missing " + field + " in JsonFormBuilder() instanciation options");
        return;
      }

      if ("mode" === field.substr(field.length - 4)) {
        if ("multiply" !== options[field] && "fixed" !== options[field]) {
          console.error(field + " in JsonFormBuilder() instanciation must be either of \"multiply\" or \"fixed\"");
          return;
        }
      } else {
        var int_val = parseInt(options[field]);

        if (isNaN(int_val)) {
          console.error(field + " in JsonFormBuilder() instanciation must be a number");
          return;
        }
      }
    } // Now set the options


    this.config.price_multiplier = parseFloat(options.price_multiplier);
    this.config.price_multiplier_mode = options.price_multiplier_mode;
    this.config.compare_multiplier = parseFloat(options.compare_multiplier);
    this.config.compare_multiplier_mode = options.compare_multiplier_mode; // Store the data in formatted way

    this.$options = this.JsonData.options;
    this.$variants = [];
    var randomDigits = 10000000 + Math.floor(Math.random() * 90000000); // console.log(this.config.price_multiplier_mode, this.config.compare_multiplier_mode);

    this.JsonData.variants.forEach(function (v, i) {
      var cost = undefined !== v.skuSalePrice ? v.skuSalePrice : skuPrice;
      var costFloat = parseFloat(cost);
      var price = "multiply" === _this.config.price_multiplier_mode ? costFloat * _this.config.price_multiplier : costFloat + _this.config.price_multiplier;
      var comparedAtPrice = "multiply" === _this.config.compare_multiplier_mode ? costFloat * _this.config.compare_multiplier : costFloat + _this.config.compare_multiplier; // console.log(cost, this.config.price_multiplier, this.config.compare_multiplier, price, comparedAtPrice);

      var pushPrice = undefined !== v.price ? v.price : _this.roundNumber(price).toFixed(2);
      var pushComparePrice = undefined !== v.comparePrice ? v.comparePrice : _this.roundNumber(comparedAtPrice).toFixed(2); // If cents are available, change it to xxx.99

      pushPrice = typeof pushPrice === 'string' && _this.config.price_cents !== null ? pushPrice.split('.')[0] + '.' + _this.config.price_cents : pushPrice;
      pushComparePrice = typeof pushComparePrice === 'string' && _this.config.price_compare_cents !== null ? pushComparePrice.split('.')[0] + '.' + _this.config.price_compare_cents : pushComparePrice;

      var $fulFillName = _this.getOrGenerateFulFillName(v.fulfillName, v.variantName);

      _this.$variants.push({
        id: i,
        variantImages: v.variantImages,
        SKUId: v.SKUId,
        typeID: v.typeID,
        variantName: v.variantName,
        fulfillName: $fulFillName,
        // Parse the JSON
        skuPrice: v.skuPrice,
        skuSalePrice: v.skuSalePrice,
        inventory: v.inventory,
        shipsFrom: v.shipsFrom,
        // Vendor specific properties
        CJvariantName: undefined !== v.CJvariantName ? v.CJvariantName : undefined,
        CJ_ID: undefined !== v.ID ? v.ID : undefined,
        variant_id: v.variant_id,
        // New elements (__attr__ means hidden elements)
        __cost__: cost,
        __randomNumber__: randomDigits,
        __shipping__: _this.config.shipping.price !== undefined ? _this.config.shipping.price : 0,
        price: pushPrice,
        comparePrice: pushComparePrice,
        shopSKU: undefined !== v.shopSKU ? v.shopSKU : _this.getShopSku(randomDigits, v.variantName)
      });
    });
    this.updateOptionsUseCount(); // Set the Selectors

    this.generateSelectors();
    this.updateDOMSelectors(); // Build the form from Data

    this.buildForm();
    this.updateDeleteButtonState();
    this.addEventListeners();
    return this;
  }

  _createClass(JsonFormBuilder, [{
    key: "getOrGenerateFulFillName",
    value: function getOrGenerateFulFillName(fulfillName, variantName) {
      var _this2 = this;

      fulfillName = undefined === fulfillName || "{}" === fulfillName || null === fulfillName ? "{}" : fulfillName;
      var $fulFillName = JSON.parse(fulfillName);
      var $variantNames = variantName.split(',');

      if ($variantNames.length >= 0 && $variantNames[0] !== "") {
        // this means we have variants, not an empty string
        if (Object.keys($fulFillName).length !== $variantNames.length) {
          // fulfillName doesn't match with variantName, let's change it
          $variantNames.forEach(function (name, index) {
            // console.log(index, name);
            var $optionName = Object.keys(_this2.$options)[index];
            $fulFillName[$optionName] = (_this2.$options[$optionName].indexOf(name) + 1).toString();

            if ($fulFillName[$optionName] === 0) {
              console.error("Couldn't find \"".concat(name, "\" on \"options[").concat($optionName, "]\""));
            }
          });
        }
      }

      return $fulFillName;
    }
  }, {
    key: "getShopSku",
    value: function getShopSku(randomDigits, variantName) {
      return randomDigits + "-" + variantName.replace(/[^A-Za-z0-9.]+/g, "-");
    }
  }, {
    key: "updateShopSKU",
    value: function updateShopSKU(variant_index) {
      var variant = this.$variants[variant_index];
      variant.shopSKU = this.getShopSku(variant.__randomNumber__, variant.variantName);
      this.config.jQuery(this.config.table).find('tr#variant_' + variant.id).find('input.shop-sku-field').val(variant.shopSKU);
    }
  }, {
    key: "buildForm",
    value: function buildForm() {
      // First, update the columns with additional options
      this.updateColumns();
      this.updateDOMTable();
      var content = this.generateContent(); // Now inject the contents in the table

      this.config.jQuery(this.config.table).find('tbody').html(content);
    }
  }, {
    key: "generateOptionsUseCount",
    value: function generateOptionsUseCount() {
      var _this3 = this;

      var options_use_count = {};
      Object.keys(this.$options).forEach(function (option) {
        options_use_count[option] = [];

        _this3.$options[option].forEach(function (value, index) {
          options_use_count[option].push(0);
        });
      });
      this.$options_use_count = options_use_count;
    }
  }, {
    key: "updateOptionsUseCount",
    value: function updateOptionsUseCount() {
      var _this4 = this;

      this.generateOptionsUseCount();
      this.$variants.forEach(function (variant) {
        Object.keys(variant.fulfillName).forEach(function (key) {
          _this4.$options_use_count[key][variant.fulfillName[key] - 1]++;
        });
      });
    }
  }, {
    key: "removeUnusedOptions",
    value: function removeUnusedOptions() {
      var _this5 = this;

      // For each option
      Object.keys(this.$options).forEach(function (option) {
        var deleteLater = []; // For each value of option

        _this5.$options[option].forEach(function (value, index) {
          if (_this5.$options_use_count[option][index] === 0) {
            var _loop = function _loop(i) {
              var nextOption = _this5.$options[option][i]; // console.log(nextOption, i);
              // update top DOM list

              _this5.config.jQuery(_this5.config.selectors + " a.nav-link[data-option='" + option + "'][data-s_index='" + i + "']").attr('data-s_index', i - 1); // update $variants.fulfillName[option] by -1 for 
              // update tr#variant_# [data-option="OPTION"] data-s_index by -1


              _this5.$variants.filter(function (v) {
                // console.log("Finding " + (i+1) + " index for " + nextOption);
                return v.fulfillName[option] === i + 1 + "";
              }).forEach(function (variant) {
                // console.log("Found at",variant.variantName, variant.fulfillName[option]);
                // console.log("Before update",variant.variantName, " = ", variant.fulfillName[option]);
                variant.fulfillName[option] = i + ""; // console.log("After update",variant.variantName, " = ", variant.fulfillName[option]);
                // console.log(variant);

                _this5.config.jQuery(_this5.config.table + " tr#variant_" + variant.id + " td[data-option='" + option + "']").attr('data-s_index', i - 1 + "");
              });
            };

            // console.log("Found zero length for : " + this.$options[option][index]);
            // update next options in $variants and DOM by -1
            for (var i = index + 1; i < _this5.$options[option].length; i++) {
              _loop(i);
            } // remove this option from $options and $options_use_count and DOM top list


            deleteLater.push({
              index: index,
              option: option,
              value: value
            });
          }
        });

        deleteLater.forEach(function (d) {
          // Update Index
          d.index = _this5.$options[d.option].findIndex(function (o) {
            return o === d.value;
          }); // console.log(this.$options[d.option]);
          // console.log("Deleting " + d.index + "-" + d.value);

          _this5.$options[option].splice(d.index, 1);

          _this5.$options_use_count[option].splice(d.index, 1); // console.log(this.$options[d.option]);


          _this5.config.jQuery(_this5.config.selectors + " a.nav-link[data-option='" + d.option + "'][data-selector='" + d.value + "']").remove();
        });
      });
    }
  }, {
    key: "calculateAndUpdateProfit",
    value: function calculateAndUpdateProfit(v) {
      var profit = this.calculateProfit(v);
      var $profitTD = $(this.config.table + " tr#variant_" + v.id).find('.jfb-profit-field').parent(); // Update DOM to success or danger

      if (parseFloat(profit) < 0) {
        $profitTD.removeClass('text-success');
        $profitTD.addClass('text-danger');
      } else {
        $profitTD.removeClass('text-danger');
        $profitTD.addClass('text-success');
      } // Update profit field


      $(this.config.table + " tr#variant_" + v.id).find('.jfb-profit-field').text(profit);
    }
  }, {
    key: "trancatedValue",
    value: function trancatedValue(value) {
      var maximumLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
      var expander = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "...";

      if (value === undefined || typeof value !== "string") {
        return '';
      }

      if (value.length <= maximumLength) {
        return value;
      }

      return value.substring(0, maximumLength - expander.length) + expander;
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      var $ = this.config.jQuery;
      var thisClass = this; // Only add these Listeners on First Instanciation
      //if (undefined === window.JFB_EVENT_LISTENERS_REGISTERED || false === window.JFB_EVENT_LISTENERS_REGISTERED){
      //  window.JFB_EVENT_LISTENERS_REGISTERED = true;

      $(document).ready(function () {
        // Top Selector Event Listener
        $(document).off('click', thisClass.config.selectors + "  a.nav-link").on('click', thisClass.config.selectors + "  a.nav-link", function (e) {
          e.preventDefault();
          var key = $(this).attr('data-selector');
          var option = $(this).attr('data-option');
          var s_index = parseInt($(this).attr('data-s_index')); // Change Selected Selector

          $(thisClass.config.selectors + "  a.active").removeClass('active');
          $(this).addClass('active');

          if ("All" === key) {
            $('.main-checkbox').each(function () {
              $(this).prop('checked', true);
            });
          } else if ("None" === key) {
            $('.main-checkbox').each(function () {
              $(this).prop('checked', false);
            });
          } else {
            // Uncheck All
            $('.main-checkbox').each(function () {
              $(this).prop('checked', false);
            }); // Check All with that option

            thisClass.$variants.forEach(function (v) {
              console.log("Finding to check : " + (s_index + 1));

              if (v.fulfillName[option] === s_index + 1 + "") {
                $("#variant_" + v.id).find(".main-checkbox").prop('checked', true);
              }
            });
          }

          thisClass.updateDeleteButtonState();
        }); // Update delete button stata on checkbox selection

        $(document).off('click', thisClass.config.table + " .main-checkbox").on('click', thisClass.config.table + " .main-checkbox", function (e) {
          thisClass.updateDeleteButtonState();
        }); // Delete Button Action

        $(document).off('click', thisClass.config.table + " .jfb-delete-button").on('click', thisClass.config.table + " .jfb-delete-button", function (e) {
          var _this7 = this;

          // console.log('delete action called');return;
          var sure = false;

          if (typeof window.rushModalConfirm === 'function') {
            rushModalConfirm({
              title: 'Confirm',
              content: 'Are you sure you want to delete these variants?',
              buttons: {
                ok: 'Yes Delete',
                cancel: 'Cancel'
              },
              callback: function callback(e) {
                var _this6 = this;

                if (e == 'Ok') {
                  $("#RushModal").modal("hide");
                  sure = true;
                  var selectedVariants = thisClass.getSelectedVariants();

                  if (sure && selectedVariants.length > 0) {
                    selectedVariants.forEach(function (id) {
                      if (thisClass.$variants.length === 1) {
                        alert('At least one variant must exist.');
                        return;
                      } // Remove variant from $variants


                      thisClass.$variants.splice(thisClass.getVariantIndexByID(id), 1); // Remove variant from DOM

                      $(thisClass.config.table + " tr#variant_" + id).remove();
                      $(_this6).attr('disabled', true); // Update Delete Fields

                      thisClass.updateOptionsUseCount();
                      thisClass.removeUnusedOptions();
                    });
                  }

                  return true;
                }
              }
            });
          } else {
            sure = confirm('Are you sure you want to delete these variants?');
            var selectedVariants = thisClass.getSelectedVariants(); // console.log(sure);

            if (sure && selectedVariants.length > 0) {
              selectedVariants.forEach(function (id) {
                if (thisClass.$variants.length === 1) {
                  alert('At least one variant must exist.');
                  return;
                } // Remove variant from $variants


                thisClass.$variants.splice(thisClass.getVariantIndexByID(id), 1); // Remove variant from DOM

                $(thisClass.config.table + " tr#variant_" + id).remove();
                $(_this7).attr('disabled', true); // Update Delete Fields

                thisClass.updateOptionsUseCount();
                thisClass.removeUnusedOptions();
              });
            } // console.error("Function window.rushModalConfirm not found.");

          }
        }); // Change Shipping Action

        $(document).off('click', thisClass.config.table + " #changeShipping").on('click', thisClass.config.table + " #changeShipping", function (e) {
          var button = $(this);
          thisClass.config.changeShippingFunction(function () {
            var price = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var country = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
            thisClass.config.shipping.price = price;
            thisClass.config.shipping.country = country;
            thisClass.config.shipping.option = option;
            window.SHIPPING_INFO = thisClass.config.shipping;
            thisClass.$variants.forEach(function (v) {
              // console.log(v.id);
              // update variant
              v.__shipping__ = thisClass.roundNumber(price); // Change the shipping price

              $(thisClass.config.table + " tr#variant_" + v.id).find('.shipping-cost').text("US$ " + thisClass.roundNumber(price).toFixed(2)); // Update profit for each element

              thisClass.calculateAndUpdateProfit(v);
            });
            button.find('.country').text(thisClass.trancatedValue(country, 13));
            button.find('.option').text(thisClass.trancatedValue(option, 13));
          }, {
            country: thisClass.config.shipping.country,
            option: thisClass.config.shipping.option
          });
        }); // Edit Option Event Listener

        var EditOptionListener = function EditOptionListener(e) {
          var option = $(this).parent().attr('data-option');
          var s_index = $(this).parent().attr('data-s_index');
          var s_name = thisClass.$options[option][s_index];
          var value = $(this).val();
          var originalValue = $(this).attr('value');
          var thisField = $(this);
          var variant_id = $(this).parent().parent().attr('id').substr(8);
          var variant_index = thisClass.getVariantIndexByID(variant_id); // Can't be empty

          if ("" === value || null === value) {
            $(this).val(s_name);
            return;
          } // console.log(option,s_index,s_name);
          // Check whether this is a new value


          var new_index = thisClass.$options[option].indexOf(value);
          var isNew = new_index <= -1; // If new, add it to the options and update top bar

          if (isNew) {
            // Add this to options
            new_index = thisClass.$options[option].push(value) - 1; // Add this to Selectors and Top Bar

            $(thisClass.config.selectors).find('.selector-' + option.replace(" ", "-")).append("\n              <a class=\"nav-link\" href=\"#\" data-option=\"".concat(option, "\" data-selector=\"").concat(value, "\" data-s_index=\"").concat(new_index, "\">").concat(value, "</a>\n            "));
            console.log("New - " + value);
          } else {
            // If not new, check whether it is unique for all variants
            // check for uniqueness
            console.log("Existing - Check uniqueness - " + value);
            var unique = true;
            thisClass.$variants.filter(function (v) {
              return v.fulfillName[option] === new_index + 1 + "";
            }).forEach(function (v) {
              var thisfulfillName = _objectSpread({}, thisClass.$variants[variant_index].fulfillName);

              thisfulfillName[option] = new_index + 1 + "";
              var thisString = JSON.stringify(thisfulfillName);
              var compareToString = JSON.stringify(v.fulfillName); // console.log(thisString,variant_id,compareToString,v.id);

              if (thisString === compareToString && thisClass.$variants[variant_index].id !== v.id) {
                // console.log("Matched",thisString,variant_id,compareToString,v.id);
                unique = false;
              }
            });

            if (!unique) {
              alert("This options combination is not unique");
              thisField.val(originalValue);
              return;
            }
          } // Update the variants field for this row with associated index


          thisClass.$variants[variant_index].fulfillName[option] = new_index + 1 + "";
          thisClass.$variants[variant_index].variantName = thisClass.generateVariantName(thisClass.$variants[variant_index].fulfillName);
          $(this).parent().attr('data-s_index', new_index);
          thisField.attr('value', value); // Update shopSKU Field
          // thisClass.updateShopSKU(variant_index);
          // Update options use count

          thisClass.updateOptionsUseCount();
          thisClass.removeUnusedOptions(); // console.log(thisClass.$variants[variant_index]);
          // Update selected status
        };

        $(document).off('blur', ".jfb_option_input").on('blur', ".jfb_option_input", EditOptionListener); // Edit shop sku field

        $(document).off('blur', thisClass.config.table + ' .shop-sku-field').on('blur', thisClass.config.table + ' .shop-sku-field', function () {
          var thisField = $(this);
          var variant_id = thisField.parent().parent().attr('id').substr(8);
          var variant_index = thisClass.getVariantIndexByID(variant_id);
          var thisValue = thisField.val();
          var originalValue = $(this).attr('value'); // check for uniqueness

          var unique = true;
          $(thisClass.config.table + ' .shop-sku-field').each(function () {
            var value_matched = $(this).val() === thisValue;

            if (value_matched && $(this)[0] !== thisField[0]) {
              unique = false;
            }
          });

          if (unique) {
            thisClass.$variants[variant_index].shopSKU = thisValue;
            thisField.attr('value', thisValue);
          } else {
            alert("This SKU already exists on other variants.");
            thisField.val(originalValue);
          } // console.log(value, val2);

        }); // Edit Price Field

        var EditPriceListener = function EditPriceListener(e) {
          var price = $(this).val();

          if (isNaN(parseFloat(price))) {
            return;
          }

          var variant_id = $(this).parent().parent().parent().attr('id').substr(8);
          var variant_index = thisClass.getVariantIndexByID(variant_id);
          var variant = thisClass.$variants[variant_index]; // Update $variants value

          variant.price = thisClass.roundNumber(price).toFixed(2); // thisClass.$variants[variant_index].price(thisClass.roundNumber(price));
          // Update Dependencies (profit field)

          if ("change" === e.type) {
            $(this).val(variant.price);
          }

          thisClass.calculateAndUpdateProfit(variant);
        };

        $(document).off('keyup', thisClass.config.table + " .jfb-price-field").on('keyup', thisClass.config.table + " .jfb-price-field", EditPriceListener);
        $(document).off('change', thisClass.config.table + " .jfb-price-field").on('change', thisClass.config.table + " .jfb-price-field", EditPriceListener);

        var EditComparePriceListener = function EditComparePriceListener(e) {
          var price = $(this).val();

          if (isNaN(parseFloat(price))) {
            return;
          }

          var variant_id = $(this).parent().parent().parent().attr('id').substr(8);
          var variant_index = thisClass.getVariantIndexByID(variant_id);
          var variant = thisClass.$variants[variant_index]; // Update $variants value

          variant.comparePrice = thisClass.roundNumber(price).toFixed(2); // Update Dependencies (profit field)

          if ("change" === e.type) {
            $(this).val(variant.comparePrice);
          }
        };

        $(document).off('keyup', thisClass.config.table + " .jfb-compare-price-field").on('keyup', thisClass.config.table + " .jfb-compare-price-field", EditComparePriceListener);
        $(document).off('change', thisClass.config.table + " .jfb-compare-price-field").on('change', thisClass.config.table + " .jfb-compare-price-field", EditComparePriceListener); // Change all prices

        $(document).off('click', thisClass.config.table + " .price-change-all .dropdown-item").on('click', thisClass.config.table + " .price-change-all .dropdown-item", function () {
          var mode = $(this).data('mode');
          $(thisClass.config.table + ' .price-change-all .change-input').attr('data-mode', mode);
          $(thisClass.config.table + ' .price-change-all .change-input').css('display', 'flex');
        }); // Apply Button Click

        $(document).off('click', thisClass.config.table + " .price-change-all .apply-button").on('click', thisClass.config.table + " .price-change-all .apply-button", function () {
          var $inputContainer = $(this).parent().parent();
          var mode = $inputContainer.attr('data-mode'); // if "new", then set new value, otherwise multiply

          var value = $inputContainer.find('.input>input').val();

          if (isNaN(value) || null === value || "" === value) {
            return;
          }

          thisClass.$variants.forEach(function (v) {
            var new_price = "new" === mode ? thisClass.roundNumber(value) : thisClass.roundNumber(parseFloat(v.__cost__) * parseFloat(value)); // Set the price to $variant

            v.price = new_price.toFixed(2); // 2 decimal places

            if ("multiply" === mode && thisClass.config.price_cents !== null) {
              // Change the cents. For Example: 4.57 -> 4.99
              v.price = v.price.split('.')[0] + '.' + thisClass.config.price_cents;
            } // Update DOM Dependencies


            $(thisClass.config.table + ' tr#variant_' + v.id + ' .jfb-price-field').val(v.price); // Price Field

            thisClass.calculateAndUpdateProfit(v);
          });
          $(this).val("");
          $inputContainer.hide();
        }); // Change all compare prices

        $(document).off('click', thisClass.config.table + " .compare-price-change-all .dropdown-item").on('click', thisClass.config.table + " .compare-price-change-all .dropdown-item", function () {
          var mode = $(this).data('mode');
          $(thisClass.config.table + ' .compare-price-change-all .change-input').attr('data-mode', mode);
          $(thisClass.config.table + ' .compare-price-change-all .change-input').css('display', 'flex');
        }); // Apply Button Click Compare prices

        $(document).off('click', thisClass.config.table + " .compare-price-change-all .apply-button").on('click', thisClass.config.table + " .compare-price-change-all .apply-button", function () {
          var $inputContainer = $(this).parent().parent();
          var mode = $inputContainer.attr('data-mode'); // if "new", then set new value, otherwise multiply

          var value = $inputContainer.find('.input>input').val();

          if (isNaN(value) || null === value || "" === value) {
            return;
          }

          thisClass.$variants.forEach(function (v) {
            var new_price = "new" === mode ? thisClass.roundNumber(value) : thisClass.roundNumber(parseFloat(v.__cost__) * parseFloat(value)); // Set the price to $variant

            v.comparePrice = new_price.toFixed(2); // 2 decimal places

            if ("multiply" === mode && thisClass.config.price_compare_cents !== null) {
              // Change the cents. For Example: 4.57 -> 4.99
              v.comparePrice = v.comparePrice.split('.')[0] + '.' + thisClass.config.price_compare_cents;
            } // Update DOM Dependencies


            $(thisClass.config.table + ' tr#variant_' + v.id + ' .jfb-compare-price-field').val(v.comparePrice);
          });
          $(this).val("");
          $inputContainer.hide();
        }); // Close Button Click

        $(document).off('click', thisClass.config.table + " .close-button").on('click', thisClass.config.table + " .close-button", function () {
          $(this).parent().parent().css('display', 'none');
        });
      }); //} else {
      // Do nothing
      //}
    }
  }, {
    key: "calculateProfit",
    value: function calculateProfit(variant) {
      var profit = parseFloat(variant.price) - parseFloat(variant.__cost__) - parseFloat(variant.__shipping__);
      return this.roundNumber(profit).toFixed(2);
    }
  }, {
    key: "getVariantIndexByID",
    value: function getVariantIndexByID(id) {
      return this.$variants.findIndex(function (el) {
        return el.id === parseInt(id);
      });
    }
  }, {
    key: "generateVariantName",
    value: function generateVariantName(fulfillName) {
      var _this8 = this;

      var v_name = [];
      Object.keys(this.$options).forEach(function (v) {
        v_name.push(_this8.$options[v][fulfillName[v] - 1]);
      });
      return v_name.join(',');
    }
  }, {
    key: "updateColumns",
    value: function updateColumns() {
      if (Object.keys(this.$options).length > 0) {
        var _this$$columns;

        (_this$$columns = this.$columns).splice.apply(_this$$columns, [3, 0].concat(_toConsumableArray(Object.keys(this.$options))));
      }
    }
  }, {
    key: "updateDOMTable",
    value: function updateDOMTable() {
      var titles = '';
      var buttons = '';
      var blankColumns = 3 + Object.keys(this.$options).length; // Generate Titles

      this.$columns.forEach(function (v, i) {
        titles += "<th scope=\"col\" class=\"\">".concat(v, "</th>");
      }); // Generate Buttons

      buttons += "\n        <th colspan=\"1\"><button class=\"btn btn-danger jfb-delete-button btn-sm\" disabled>Delete</button></th>\n        <th colspan=\"".concat(blankColumns, "\"></th>\n        <th colspan=\"1\" id=\"changeShipping\">\n          <button class=\"btn btn-primary btn-sm\">\n            <span class=\"country\">").concat(this.trancatedValue(this.config.shipping.country, 13), "</span> - \n            <span class=\"option\">").concat(this.trancatedValue(this.config.shipping.option, 13), "</span>\n          </button>\n        </th>\n        <th colspan=\"1\">\n          <div class=\"dropdown price-change-all\">\n            <button class=\"btn btn-primary btn-sm dropdown-toggle\" type=\"button\" id=\"dropdownMenuButton\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n              Change All\n            </button>\n            <div class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuButton\">\n              <a class=\"dropdown-item\" data-mode=\"new\" href=\"#\">Set New Value</a>\n              <a class=\"dropdown-item\" data-mode=\"multiply\" href=\"#\">Multiply By</a>\n            </div>\n            <div class=\"change-input\" data-mode=\"new\">\n              <div class=\"input\">\n                <input type=\"text\" placeholder=\"Enter Value\" class=\"form-control\" />\n              </div>\n              <div class=\"buttons\">\n                <button type=\"submit\" class=\"btn btn-primary apply-button\">Apply</button>\n                <button type=\"close\" class=\"btn btn-danger close-button\">X</button>\n              </div>\n            </div>\n          </div>\n        </th>\n        <th colspan=\"1\"></th>\n        <th colspan=\"1\">\n          <div class=\"dropdown compare-price-change-all\">\n            <button class=\"btn btn-primary btn-sm dropdown-toggle\" type=\"button\" id=\"dropdownMenuButton\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n              Change All\n            </button>\n            <div class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuButton\">\n              <a class=\"dropdown-item\" data-mode=\"new\" href=\"#\">Set New Value</a>\n              <a class=\"dropdown-item\" data-mode=\"multiply\" href=\"#\">Multiply By</a>\n            </div>\n            <div class=\"change-input\" data-mode=\"new\">\n              <div class=\"input\">\n                <input type=\"text\" placeholder=\"Enter Value\" class=\"form-control\" />\n              </div>\n              <div class=\"buttons\">\n                <button type=\"submit\" class=\"btn btn-primary apply-button\">Apply</button>\n                <button type=\"close\" class=\"btn btn-danger close-button\">X</button>\n              </div>\n            </div>\n          </div>\n        </th>\n    ");
      this.config.jQuery(this.config.table).find('thead>tr.titles').html(titles);
      this.config.jQuery(this.config.table).find('thead>tr.buttons').html(buttons);
    }
  }, {
    key: "generateSelectors",
    value: function generateSelectors() {
      var _this9 = this;

      var selectors = [{
        option: "All",
        selector: "All",
        index: -1
      }, {
        option: "None",
        selector: "None",
        index: -2
      }];

      if (Object.keys(this.$options).length > 0) {
        Object.keys(this.$options).forEach(function (v) {
          _this9.config.initialCounts[v] = _this9.$options[v].length;

          _this9.$options[v].forEach(function (element, index) {
            selectors.push({
              option: v,
              selector: element,
              index: index
            });
          });
        });
      }

      this.$selectors = selectors;
    }
  }, {
    key: "updateDOMSelectors",
    value: function updateDOMSelectors() {
      var selectors = "<div class=\"All\">";
      var option = "All";
      this.$selectors.forEach(function (v, i) {
        if (option !== v.option) {
          selectors += "</div><div class='selector-" + v.option.replace(" ", "-") + "'>";
        }

        selectors += "<a class=\"nav-link".concat(i == 0 ? ' active' : '', "\" href=\"#\" data-option=\"").concat(v.option, "\" data-selector=\"").concat(v.selector, "\" data-s_index=\"").concat(v.index, "\">").concat(v.selector, "</a>");
        option = v.option;
      });
      selectors += "</div>";
      this.config.jQuery(this.config.selectors).html(selectors);
    }
  }, {
    key: "generateContent",
    value: function generateContent() {
      var _this10 = this;

      var content = ''; // Original Checkbox Was: <input class="main-checkbox" type="checkbox" name="checkbox[]" checked />
      // Updated to Bootstrap-4 Custom Checkbox

      this.$variants.forEach(function (variant, index) {
        content += "\n      <tr id=\"variant_".concat(variant.id, "\">\n        <th scope=\"row\">\n          <div class=\"custom-control custom-checkbox\">\n            <input type=\"checkbox\" class=\"custom-control-input main-checkbox\" id=\"customCheck_").concat(variant.id, "\" name=\"checkbox[]\" checked>\n            <label class=\"custom-control-label\" for=\"customCheck_").concat(variant.id, "\"></label>\n          </div>\n        </th>\n        <td class=\"jfb-img-td\"><img src=\"").concat(variant.variantImages, "\" alt=\"\"></td>\n        <td><input class=\"form-control shop-sku-field\" type=\"text\" name=\"shop_sku_").concat(variant.id, "\" value=\"").concat(variant.shopSKU, "\" /></td>");
        console.log(_this10.$options);
        console.log(variant.fulfillName);

        if (Object.keys(_this10.$options).length > 0) {
          Object.keys(_this10.$options).forEach(function (v, i) {
            content += "\n            <td data-option=\"".concat(v, "\" data-s_index=\"").concat(variant.fulfillName[v] - 1, "\"><input class=\"form-control jfb_option_input\" type=\"text\" name=\"color_of_").concat(variant.id, "\" value=\"").concat(_this10.$options[v][variant.fulfillName[v] - 1], "\" /></td>\n          ");
          });
        }

        content += "\n        <td class=\"jfb-nowrap\">US$ ".concat(variant.__cost__, "</td>\n        <td class=\"shipping-cost\">").concat(_this10.config.shipping.price !== undefined ? "US$ " + _this10.roundNumber(_this10.config.shipping.price).toFixed(2) : "--", "</td> <!-- Shipping -->\n        <td>\n          <div class=\"input-group\">\n            <div class=\"input-group-prepend\">\n              <span class=\"input-group-text\" id=\"basic-addon1\">US$</span>\n            </div>\n            <input class=\"form-control jfb-price-field\" type=\"text\" name=\"price_").concat(variant.id, "\" value=\"").concat(_this10.roundNumber(variant.price).toFixed(2), "\" />\n          </div>\n        </td> <!-- Price -->\n        <td class=\"jfb-nowrap ").concat(parseFloat(_this10.calculateProfit(variant)) < 0 ? 'text-danger' : 'text-success', "\">US$ <span class=\"jfb-profit-field\">").concat(_this10.roundNumber(_this10.calculateProfit(variant)).toFixed(2), "</span></td> <!-- Profit -->\n        <td>\n          <div class=\"input-group\">\n            <div class=\"input-group-prepend\">\n              <span class=\"input-group-text\" id=\"basic-addon1\">US$</span>\n            </div>\n            <input class=\"form-control jfb-compare-price-field\" type=\"text\" name=\"comparePrice_").concat(variant.id, "\" value=\"").concat(_this10.roundNumber(variant.comparePrice).toFixed(2), "\" />\n          </div>\n        </td> <!-- Compared At Price -->\n        <td>").concat(variant.inventory, "</td>\n      </tr>\n      ");
      });
      return content;
    }
  }, {
    key: "getSelectedVariants",
    value: function getSelectedVariants() {
      var ids = [];
      this.config.jQuery(this.config.table + " .main-checkbox:checked").each(function () {
        ids.push($(this).parent().parent().parent().attr('id').substr(8));
      });
      return ids;
    }
  }, {
    key: "updateDeleteButtonState",
    value: function updateDeleteButtonState() {
      if (this.getSelectedVariants().length > 0) {
        this.config.jQuery(this.config.table + " .jfb-delete-button").removeAttr('disabled');
      } else {
        this.config.jQuery(this.config.table + " .jfb-delete-button").attr('disabled', true);
      }
    }
  }, {
    key: "roundNumber",
    value: function roundNumber(num) {
      num = parseFloat(num);
      return Math.round((num + Number.EPSILON) * 100) / 100;
    }
  }, {
    key: "generateExportData",
    value: function generateExportData() {
      this.updateOptionsUseCount();
      this.removeUnusedOptions();
      var exportData = {};
      exportData.options = this.$options;
      exportData.variants = this.$variants.map(function (v) {
        var variant = {
          variantImages: v.variantImages,
          SKUId: v.SKUId,
          typeID: v.typeID,
          variantName: v.variantName,
          fulfillName: JSON.stringify(v.fulfillName),
          // Stringify JSON
          skuPrice: v.skuPrice,
          skuSalePrice: v.skuSalePrice,
          inventory: v.inventory,
          shipsFrom: v.shipsFrom,
          // New Attributes
          price: v.price,
          comparePrice: v.comparePrice,
          shopSKU: v.shopSKU
        };

        if (undefined !== v.CJvariantName) {
          variant.CJvariantName = v.CJvariantName;
        }

        if (undefined !== v.CJ_ID) {
          variant.ID = v.CJ_ID;
        }

        variant.variant_id = v.variant_id;
        return variant;
      });
      return JSON.stringify(exportData);
    }
  }]);

  return JsonFormBuilder;
}();