
        <form id="form_1" class="pjax" method="post" novalidate>

          <fieldset>
          
            <div class="validation-summary hidden"></div>
          
            <legend>Form 1</legend>
            
            <div class="form-field text required">
              <label>Name:</label>
              <input name="form_1[name]" type="text" value="">
            </div>
            
            <div class="form-field number required">
              <label>Number:</label>
              <input name="form_1[number]" type="number" value="">
            </div>
            
            <div class="form-field currency required">
              <label>Currency:</label>
              <input name="form_1[amount]" type="text" value="" data-format="R|2|,">
            </div>
            
            <div class="form-field email required">
              <label>Email:</label>
              <input name="form_1[email]" type="email" value="" placeholder="e.g. john.doe@example.com">
            </div>
            
            <div class="form-field memo required">
              <label>Memo:</label>
              <textarea name="form_1[memo]" rows="3" placeholder="Enter note here..."></textarea>
            </div>
            
            <div class="form-field checkbox required">
              <label>Single Checkbox:</label>
              <input name="form_1[confirm]" type="checkbox" value="1" checked>
            </div>
            
            <div class="form-actions-bar">
              <button class="button primary" type="submit" onclick="F1.alerts.add('Nice submit!')">Submit</button>
              <button class="button primary" type="submit" name="refresh" onclick="F1.alerts.add('Nice submit!', 'success', 7000)">Refresh</button>
              <button class="button primary" type="submit" name="delete-item" value="1" onclick="F1.confirm(this, event)">Delete Item</button>
            </div>
            
          </fieldset>
          
        </form>
