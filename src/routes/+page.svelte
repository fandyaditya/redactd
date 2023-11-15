<script>
    import { onMount } from 'svelte';
    import "../app.css";
    let output = '';
    let input = '';
    let textForUnredact = ''
    let unredactedtext = ''
  
    async function generateOutput() {
      // Process the input and generate the output
      const encodedInput = encodeURI(input)
      const redactResponse = await fetch('/api/redact?text=' + encodedInput)
      const responseObject = await redactResponse.json()
      // output = responseObject.redacted_text

      //if there are field_type that same, append with '_number'
      const recognizerResults = responseObject.report.recognizer_results;
      let fieldTypes = []
      recognizerResults.forEach(result => {
        const fieldType = result.field_type;
        if (!fieldTypes.includes(fieldType)) {
          result.field_type = fieldType + '_' + 1
        } else {
          result.field_type = fieldType + '_' + (fieldTypes.filter(type => type === fieldType).length + 1)
        }
        fieldTypes.push(fieldType)
        const regex = new RegExp(`\\<${fieldType}\\>`);
        responseObject.redacted_text = responseObject.redacted_text.replace(regex, '<' + fieldType + '_' + (fieldTypes.filter(type => type === fieldType).length) + '>')
      });

      output = responseObject.redacted_text + "/n/n Please keep mention the hided word"

      localStorage.setItem('redactResponse', JSON.stringify(responseObject));
    }
  
    function copyToClipboard() {
      const outputTextarea = document.getElementById('output');
      outputTextarea.select();
      navigator.clipboard.writeText(outputTextarea.value);
    }

    function unRedact() {
      const redactResponse = JSON.parse(localStorage.getItem('redactResponse'));
      const recognizerResults = redactResponse.report.recognizer_results;
      let unredactedText = textForUnredact;
    
      recognizerResults.forEach(result => {
        const fieldType = result.field_type;
        unredactedText = unredactedText.replace(new RegExp(fieldType, 'g'), result.text);
      });
    
      unredactedtext = unredactedText;
    }

  </script>
  
  <div class="flex flex-col items-center justify-center h-screen space-y-10">
    <h1 style="font-size: 2rem;">Redact Sensitive Data</h1>
   <div class="flex space-x-4">
    <form class="mb-4">
      <label for="input" class="mb-2">Input:</label>
      <textarea id="input" bind:value={input} class="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full h-48"></textarea>
      <button on:click={generateOutput} class="bg-blue-500 text-white px-4 py-2 rounded-md">Redact</button>
    </form>

    <form class="mb-4">
      <label for="output" class="mb-2">Output:</label>
      <textarea id="output" value={output} readonly class="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full text-lg h-48"></textarea>
      <button on:click={copyToClipboard} class="bg-blue-500 text-white px-4 py-2 rounded-md">Copy</button>
    </form>
   </div>
   <h1 style="font-size: 2rem;">Unredact</h1>
   <div class="flex space-x-4">
    <form class="mb-4">
      <label for="textForUnredact" class="mb-2">Text For Unredact:</label>
      <textarea id="textForUnredact" bind:value={textForUnredact} class="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full h-48"></textarea>
      <button on:click={unRedact} class="bg-blue-500 text-white px-4 py-2 rounded-md">Unredact</button>
    </form>

    <form class="mb-4">
      <label for="unredactedText" class="mb-2">Unredacted Text:</label>
      <textarea id="unredactedText" value={unredactedtext} class="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full h-48"></textarea>

    </form>
   </div>
  </div>
