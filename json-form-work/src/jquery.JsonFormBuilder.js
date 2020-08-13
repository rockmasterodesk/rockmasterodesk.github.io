/*
JSON Form Builder
Author: A.S.M. Asaduzzaman (https://www.upwork.com/freelancers/~0183d400d9b82308ef)
*/


class JsonFormBuilder {
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

  constructor(json_data, options = {}){
    if ("string" === typeof json_data){
      this.StringData = json_data;
      this.JsonData = JSON.parse(json_data);
    } else if ("object" === typeof json_data){
      this.JsonData = json_data;
    }

    // Set Table Columns
    this.$columns = [
      "#", "Image", "SKU", "Cost", "Shipping", "Price", "Profit", "Compared At Price", "Inventory"
    ];

    // Configuration Options
    this.config = {};
    this.config.initialCounts = {};
    this.config.table = undefined !== options.table ? options.table : ".jfb-table";
    this.config.selectors = undefined !== options.selectors ? options.selectors : ".jfb-selector-nav";
    this.config.jQuery = undefined !== options.jQuery ? options.jQuery : window.jQuery;

    // Validate required options
    const required_fields = ["price_multiplier", "price_multiplier_mode", "compare_multiplier", "compare_multiplier_mode"];
    for(let field of required_fields){
      if (undefined === options[field]){
        console.error("Missing " + field + " in JsonFormBuilder() instanciation options");
        return;
      }
      if ("mode" === field.substr(field.length-4)){
        if ("multiply" !== options[field] && "fixed" !== options[field]){
          console.error(field + " in JsonFormBuilder() instanciation must be either of \"multiply\" or \"fixed\"");
          return;
        }
      } else {
        let int_val = parseInt(options[field]);
        if (isNaN(int_val)){
          console.error(field + " in JsonFormBuilder() instanciation must be a number");
          return;
        }
      }
    }

    // Now set the options
    this.config.price_multiplier = options.price_multiplier;
    this.config.price_multiplier_mode = options.price_multiplier_mode;
    this.config.compare_multiplier = options.compare_multiplier;
    this.config.compare_multiplier_mode = options.compare_multiplier_mode;

    // Store the data in formatted way
    this.$options = this.JsonData.options;
    this.$variants = [];
    this.JsonData.variants.forEach((v,i)=>{
      let cost = undefined !== v.skuSalePrice ? v.skuSalePrice : skuPrice;
      let randomDigits = (10000000 + Math.floor(Math.random() * 90000000));
      let price = "multiply" === this.config.price_multiplier_mode ? (cost * this.config.price_multiplier) : (cost + this.config.price_multiplier);
      let comparedAtPrice = "multiply" === this.config.compare_multiplier_mode ? (cost * this.config.compare_multiplier) : (cost + this.config.compare_multiplier);
      let shipping = 0;

      this.$variants.push({
        id: i,
        variantImages: v.variantImages,
        SKUId: v.SKUId,
        typeID: v.typeID,
        variantName: v.variantName,
        fulfillName: JSON.parse(v.fulfillName), // Parse the JSON
        skuPrice: v.skuPrice,
        skuSalePrice: v.skuSalePrice,
        inventory: v.inventory,
        shipsFrom: v.shipsFrom,

        // New elements (__attr__ means hidden elements)
        __cost__: cost,
        __randomNumber__: randomDigits,
        __shipping__: 0,

        price: this.roundNumber(price).toFixed(2),
        comparePrice: this.roundNumber(comparedAtPrice).toFixed(2),
        shopSKU: this.getShopSku(randomDigits, v.variantName)

      });
    });

    // Set the Selectors
    this.generateSelectors();
    this.updateDOMSelectors();

    // Build the form from Data
    this.buildForm();

    this.updateDeleteButtonState();

    this.addEventListeners();

    return this;
  }

  getShopSku(randomDigits, variantName){
    return randomDigits + "-" + variantName.replace(/[^A-Za-z0-9.]+/g, "-"); 
  }

  updateShopSKU(variant_index){
    let variant = this.$variants[variant_index];

    variant.shopSKU = this.getShopSku(variant.__randomNumber__, variant.variantName);

    this.config.jQuery(this.config.table).find('tr#variant_'+variant.id).find('input.shop-sku-field').val(variant.shopSKU);
  }

  buildForm(){
    // First, update the columns with additional options
    this.updateColumns();
    this.updateDOMTable();

    let content = this.generateContent();

    // Now inject the contents in the table
    this.config.jQuery(this.config.table).find('tbody').html(content);
  }

  addEventListeners(){
    let $ = this.config.jQuery;
    const thisClass = this;

    $(document).ready(function(){
      // Top Selector Event Listener
      $(document).on('click', thisClass.config.selectors + "  a.nav-link", function(e){
        e.preventDefault();
        
        let key = $(this).data('selector');
        let option = $(this).data('option');
        let s_index = $(this).data('s_index');
        
        // Change Selected Selector
        $(thisClass.config.selectors + "  a.active").removeClass('active');
        $(this).addClass('active');

        if ("All" === key){
          $('.main-checkbox').each(function(){
            $(this).prop('checked', true);
          });
        } else {
          // Uncheck All
          $('.main-checkbox').each(function(){
            $(this).prop('checked', false);
          });
          // Check All with that option
          thisClass.$variants.forEach((v)=>{
            // console.log(option, v.variantName, v.fulfillName[option] === s_index + 1 + "");
            if (v.fulfillName[option] === s_index + 1 + ""){
              $("#variant_"+v.id).find(".main-checkbox").prop('checked', true);
            }
          });
        }

        thisClass.updateDeleteButtonState();
      });

      // Update delete button stata on checkbox selection
      $(document).on('click', thisClass.config.table + " .main-checkbox", function(e){
        thisClass.updateDeleteButtonState();
      });

      // Delete Button Action
      $(document).on('click', thisClass.config.table + " .jfb-delete-button", function(e){
        let sure = confirm('Are you sure you want to delete these variants?');
        let selectedVariants = thisClass.getSelectedVariants();

        if (sure && selectedVariants.length > 0){
          selectedVariants.forEach(id=>{
            // Remove variant from $variants
            thisClass.$variants.splice(thisClass.getVariantIndexByID(id),1);

            // Remove variant from DOM
            $(thisClass.config.table + " tr#variant_" + id).remove();

            $(this).attr('disabled',true);
          });
        }
      });

      // Edit Option Event Listener
      let EditOptionListener = function(e){
        let option = $(this).parent().data('option');
        let s_index = $(this).parent().data('s_index');
        let s_name = thisClass.$options[option][s_index];

        let value = $(this).val();

        console.log(option,s_index,s_name);

        // Check whether this is a new value
        let new_index = thisClass.$options[option].indexOf(value);
        let isNew = new_index <= -1;
        // If new, add it to the options and update top bar
        if (isNew){
          // Add this to options
          new_index = thisClass.$options[option].push(value) - 1 ;

          // Add this to Selectors and Top Bar
          $(thisClass.config.selectors).find('.selector-'+option.replace(" ","-")).append(`
            <a class="nav-link" href="#" data-option="${option}" data-selector="${value}" data-s_index="${new_index}">${value}</a>
          `);
        }

        // Update the variants field for this row with associated index
        let variant_id = $(this).parent().parent().attr('id').substr(8);
        let variant_index = thisClass.getVariantIndexByID(variant_id);
        thisClass.$variants[variant_index].fulfillName[option] = new_index + 1 +"";
        thisClass.$variants[variant_index].variantName = thisClass.generateVariantName(thisClass.$variants[variant_index].fulfillName);
        $(this).parent().attr('data-s_index', new_index);
        
        // Update shopSKU Field
        thisClass.updateShopSKU(variant_index);
        
        // console.log(thisClass.$variants[variant_index]);
        // Update selected status
      }
      $(document).on('blur', ".jfb_option_input", EditOptionListener);

      // Edit Price Field
      let EditPriceListener = function(e){
        let price = $(this).val();
        
        if (isNaN(parseFloat(price))){
          return;
        }


        let variant_id = $(this).parent().parent().parent().attr('id').substr(8);
        let variant_index = thisClass.getVariantIndexByID(variant_id);
        let variant = thisClass.$variants[variant_index];

        // Update $variants value
        variant.price = thisClass.roundNumber(price).toFixed(2) ;
        // thisClass.$variants[variant_index].price(thisClass.roundNumber(price));
        // Update Dependencies (profit field)
        if ("change" === e.type){
          $(this).val(variant.price);
        }
        let profit = thisClass.roundNumber(thisClass.calculateProfit(variant));
        $(thisClass.config.table + " tr#variant_"+variant.id+" span.jfb-profit-field").text(profit);
      };
      $(document).on('keyup', thisClass.config.table + " .jfb-price-field", EditPriceListener);
      $(document).on('change', thisClass.config.table + " .jfb-price-field", EditPriceListener);

      let EditComparePriceListener = function(e){
        let price = $(this).val();
        
        if (isNaN(parseFloat(price))){
          return;
        }

        let variant_id = $(this).parent().parent().parent().attr('id').substr(8);
        let variant_index = thisClass.getVariantIndexByID(variant_id);
        let variant = thisClass.$variants[variant_index];

        // Update $variants value
        variant.comparePrice = thisClass.roundNumber(price).toFixed(2);
        // Update Dependencies (profit field)
        if ("change" === e.type){
          $(this).val(variant.comparePrice);
        }
      };
      $(document).on('keyup', thisClass.config.table + " .jfb-compare-price-field", EditComparePriceListener);
      $(document).on('change', thisClass.config.table + " .jfb-compare-price-field", EditComparePriceListener);

      // Change all prices
      $(document).on('click', thisClass.config.table + " .price-change-all .dropdown-item", function(){
        let mode = $(this).data('mode');

        $(thisClass.config.table + ' .price-change-all .change-input').attr('data-mode',mode);
        $(thisClass.config.table + ' .price-change-all .change-input').css('display','flex');
      });

      // Apply Button Click
      $(document).on('click', thisClass.config.table + " .price-change-all .apply-button", function(){
        let $inputContainer = $(this).parent().parent();
        let mode = $inputContainer.attr('data-mode'); // if "new", then set new value, otherwise multiply


        let value = $inputContainer.find('.input>input').val();

        if (isNaN(value) || null === value || "" === value){
          return;
        }

        thisClass.$variants.forEach(v=>{
          let new_price = "new" === mode ? thisClass.roundNumber(value) : thisClass.roundNumber(parseFloat(v.__cost__) * parseFloat(value));
          // Set the price to $variant
          v.price = new_price.toFixed(2); // 2 decimal places

          // Update DOM Dependencies
          $(thisClass.config.table + ' tr#variant_' + v.id + ' .jfb-price-field').val(v.price); // Price Field
          $(thisClass.config.table + ' tr#variant_' + v.id + ' .jfb-profit-field').text(thisClass.calculateProfit(v)); // Price Field

        });

        $(this).val("");
        $inputContainer.hide();

      });

      // Change all compare prices
      $(document).on('click', thisClass.config.table + " .compare-price-change-all .dropdown-item", function(){
        let mode = $(this).data('mode');

        $(thisClass.config.table + ' .compare-price-change-all .change-input').attr('data-mode',mode);
        $(thisClass.config.table + ' .compare-price-change-all .change-input').css('display','flex');
      });

      // Apply Button Click Compare prices
      $(document).on('click', thisClass.config.table + " .compare-price-change-all .apply-button", function(){
        let $inputContainer = $(this).parent().parent();
        let mode = $inputContainer.attr('data-mode'); // if "new", then set new value, otherwise multiply


        let value = $inputContainer.find('.input>input').val();

        if (isNaN(value) || null === value || "" === value){
          return;
        }

        thisClass.$variants.forEach(v=>{
          let new_price = "new" === mode ? thisClass.roundNumber(value) : thisClass.roundNumber(parseFloat(v.__cost__) * parseFloat(value));
          // Set the price to $variant
          v.comparePrice = new_price.toFixed(2); // 2 decimal places

          // Update DOM Dependencies
          $(thisClass.config.table + ' tr#variant_' + v.id + ' .jfb-compare-price-field').val(v.comparePrice);
        });

        $(this).val("");
        $inputContainer.hide();

      });



      // Close Button Click
      $(document).on('click', thisClass.config.table + " .close-button", function(){
        $(this).parent().parent().css('display','none');
      });
    });
  }

  calculateProfit(variant){
    let profit = parseFloat(variant.price) - parseFloat(variant.__cost__) - parseFloat(variant.__shipping__);
    return this.roundNumber(profit).toFixed(2);
  }

  getVariantIndexByID(id){
    return this.$variants.findIndex((el)=>{return el.id === parseInt(id)});
  }

  generateVariantName(fulfillName){
    let v_name = [];
    Object.keys(this.$options).forEach(v=>{
      v_name.push(this.$options[v][fulfillName[v]-1]);
    });

    return v_name.join(',');
  }

  updateColumns(){
    if (Object.keys(this.$options).length > 0){
      this.$columns.splice(3, 0, ...Object.keys(this.$options));
    }
  }

  updateDOMTable(){
    let titles = '';
    let buttons = '';
    let blankColumns = 3 + Object.keys(this.$options).length;

    // Generate Titles
    this.$columns.forEach((v,i)=>{
      titles += `<th scope="col" class="">${v}</th>`;
    });

    // Generate Buttons
    buttons += `
        <th colspan="1"><button class="btn btn-danger jfb-delete-button btn-sm" disabled>Delete</button></th>
        <th colspan="${blankColumns}"></th>
        <th colspan="1"><button class="btn btn-primary btn-sm">USA</button></th>
        <th colspan="1">
          <div class="dropdown price-change-all">
            <button class="btn btn-primary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Change All
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" data-mode="new" href="#">Set New Value</a>
              <a class="dropdown-item" data-mode="multiply" href="#">Multiply By</a>
            </div>
            <div class="change-input" data-mode="new">
              <div class="input">
                <input type="text" placeholder="Enter Value" class="form-control" />
              </div>
              <div class="buttons">
                <button type="submit" class="btn btn-primary apply-button">Apply</button>
                <button type="close" class="btn btn-danger close-button">X</button>
              </div>
            </div>
          </div>
        </th>
        <th colspan="1"></th>
        <th colspan="1">
          <div class="dropdown compare-price-change-all">
            <button class="btn btn-primary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Change All
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" data-mode="new" href="#">Set New Value</a>
              <a class="dropdown-item" data-mode="multiply" href="#">Multiply By</a>
            </div>
            <div class="change-input" data-mode="new">
              <div class="input">
                <input type="text" placeholder="Enter Value" class="form-control" />
              </div>
              <div class="buttons">
                <button type="submit" class="btn btn-primary apply-button">Apply</button>
                <button type="close" class="btn btn-danger close-button">X</button>
              </div>
            </div>
          </div>
        </th>
    `;
    
    this.config.jQuery(this.config.table).find('thead>tr.titles').html(titles);
    this.config.jQuery(this.config.table).find('thead>tr.buttons').html(buttons);
  }

  generateSelectors(){
    let selectors = [{option:"All",selector:"All",index:-1}];
    if (Object.keys(this.$options).length > 0){
      Object.keys(this.$options).forEach((v)=>{
        this.config.initialCounts[v] = this.$options[v].length;
        this.$options[v].forEach((element, index) => {
          selectors.push({option:v, selector:element, index: index});
        });
      });
    }
    this.$selectors = selectors;
  }

  updateDOMSelectors(){
    let selectors = `<div class="All">`;
    let option = "All";

    this.$selectors.forEach((v,i)=>{
      if (option !== v.option){
        selectors += "</div><div class='selector-"+v.option.replace(" ","-")+"'>";
      }
      selectors += `<a class="nav-link${i==0 ? ' active':''}" href="#" data-option="${v.option}" data-selector="${v.selector}" data-s_index="${v.index}">${v.selector}</a>`;
      option = v.option;
    });
    selectors += "</div>";

    this.config.jQuery(this.config.selectors).html(selectors);
  }

  generateContent(){
    let content = '';
    this.$variants.forEach((variant, index)=>{
      content += `
      <tr id="variant_${variant.id}">
        <th scope="row"><input class="main-checkbox" type="checkbox" name="checkbox[]" checked /></th>
        <td class="jfb-img-td"><img src="${variant.variantImages}" alt=""></td>
        <td><input disabled class="form-control shop-sku-field" type="text" name="shop_sku_${variant.id}" value="${variant.shopSKU}" /></td>`;

      if (Object.keys(this.$options).length > 0){
        Object.keys(this.$options).forEach((v,i) => {
          content+= `
            <td data-option="${v}" data-s_index="${variant.fulfillName[v]-1}"><input class="form-control jfb_option_input" type="text" name="color_of_${variant.id}" value="${this.$options[v][variant.fulfillName[v]-1]}" /></td>
          `;
        });
      }

      content += `
        <td class="jfb-nowrap">USD$ ${variant.__cost__}</td>
        <td>--</td> <!-- Shipping -->
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1">USD$</span>
            </div>
            <input class="form-control jfb-price-field" type="text" name="price_${variant.id}" value="${this.roundNumber(variant.price).toFixed(2)}" />
          </div>
        </td> <!-- Price -->
        <td class="jfb-nowrap">USD$ <span class="jfb-profit-field">${this.roundNumber( this.calculateProfit(variant) ).toFixed(2)}</span></td> <!-- Profit -->
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1">USD$</span>
            </div>
            <input class="form-control jfb-compare-price-field" type="text" name="comparePrice_${variant.id}" value="${this.roundNumber(variant.comparePrice).toFixed(2)}" />
          </div>
        </td> <!-- Compared At Price -->
        <td>${variant.inventory}</td>
      </tr>
      `;
    });

    return content;
  }

  getSelectedVariants(){
    let ids = [];

    this.config.jQuery(this.config.table + " .main-checkbox:checked").each(function(){
      ids.push($(this).parent().parent().attr('id').substr(8));
    });

    return ids;
  }

  updateDeleteButtonState(){
    if (this.getSelectedVariants().length > 0){
      this.config.jQuery(this.config.table + " .jfb-delete-button").removeAttr('disabled');
    } else {
      this.config.jQuery(this.config.table + " .jfb-delete-button").attr('disabled', true);
    }
  }

  roundNumber(num){
    num = parseFloat(num);
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  generateExportData(){
    let exportData = {};

    exportData.options = this.$options;
    exportData.variants = this.$variants.map(v=>{
      return {
        variantImages: v.variantImages,
        SKUId: v.SKUId,
        typeID: v.typeID,
        variantName: v.variantName,
        fulfillName: JSON.stringify(v.fulfillName), // Stringify JSON
        skuPrice: v.skuPrice,
        skuSalePrice: v.skuSalePrice,
        inventory: v.inventory,
        shipsFrom: v.shipsFrom,
        
        // New Attributes
        price: v.price,
        comparePrice: v.comparePrice,
        shopSKU: v.shopSKU
      }
    });

    return JSON.stringify(exportData);
  }
}