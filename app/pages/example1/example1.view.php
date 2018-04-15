
        <form id="form_1" class="form" method="post" novalidate>

          <fieldset>
          
            <div class="validation-summary hidden"></div>
          
            <legend>Form 1</legend>
            
            <div class="form-field inline text required">
              <label>Name:</label>
              <input name="form_1[name]" type="text" value="">
            </div>
            
            <div class="form-field inline number required">
              <label>Number:</label>
              <input name="form_1[number]" type="number" value="">
            </div>
            
            <div class="form-field inline currency required">
              <label>Currency:</label>
              <input name="form_1[amount]" type="text" value="" data-format="R|2|,">
            </div>
            
            <div class="form-field inline email required">
              <label>Email:</label>
              <input name="form_1[email]" type="email" value="" placeholder="e.g. john.doe@example.com">
            </div>
            
            <div class="form-field inline memo required">
              <label>Memo:</label>
              <textarea name="form_1[email]" rows="3" placeholder="Enter note here..."></textarea>
            </div>
            
            <div class="form-field inline checkbox required">
              <label>Single Checkbox:</label>
              <input name="form_1[confirm]" type="checkbox" value="1" checked>
            </div>
            
            <div class="form-actions-bar">
              <button class="button primary" type="submit" name="submit_form_1">Submit</button>
            </div>
            
          </fieldset>
          
        </form>

        <script>
          window.F1 = window.F1 || { afterPageLoadQueue: [] };
          F1.afterPageLoadQueue.push(function initForm1() {
            alert('This is AFTER Page 1 loaded succesfully!');
          });
        </script>
