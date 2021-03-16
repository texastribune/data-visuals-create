## Graphics metadata

Graphics intended to be used as embeds in the CMS should have specific selectors present in the HTML. The values for these selectors are parsed and output into a `manifest.json` file which is used by the graphics plugin to organize our graphics inventory.


| Selector/Variable | Description | Example | Output in manifest.json |
|--|--|--|--|
| `[data-graphic]` | If present, the HTML of the page will be parsed for metadata and surfaced in the CMS | `<div class="app" data-graphic>` | N/A - If no `[data-graphic]` selector is found, the graphic won't output in manifest. |
| `{{ graphicTitle }}` or `[data-title]` | The title of the graphic in the CMS | `{% set  graphicTitle = 'Some title' %}` or `<h1 class="graphic-title" data-title>Some title</h1>` | `title: string` |
| `{{ graphicDesc }}` | The description of the graphic in the CMS. This will also be read by screenreaders in platforms like Apple News. | `{% set graphicDesc = 'This is a bar chart showing xyz' %}` | `description: string` |
| `{{ graphicSource }}` or `[data-source]` | The source of the graphic in the CMS | `{% set  graphicSource = 'TXDOT' %}` or `<li data-source>Source: TXDOT</li>` | `source: string` |
| `{{ graphicCredit }}` or `[data-credit]` | The author names for the graphic in the CMS. | `{% set  graphicCredit = 'Trib Tribington, Super Cool Corgi' %}` or `<li data-credit>Trib Tribington and Super Cool Corgi</li>`  | `credits: array` |

### Full example
```html
{% extends 'base.html' %}
{% set  context = data.text %}
{% set  graphicDesc = 'Description of graphic' %}
{% block  content %}
<div class="app" data-graphic>
	<h1 class="graphic-title" data-title>{{ context.headline }}</h1>
	{{ prose(context.prose, context, graphicData) }}
	<div id="graphic" class="graphic"></div>
	<ul class="graphic-footer">
		<li>Note: {{ context.note }}</li>
		<li data-source>Source: {{ context.source }}</li>
		<li data-credit>Credit: {{ context.credit }}</li>
	</ul>
</div>
{% endblock  content %}
```
### Full example with ai2html graphic

For Illustrator graphics, we typically set the title and other info in the Illustrator file itself and not the HTML, so we'd need to add those as nunjucks variables to surface the metadata.

```html
{% extends 'base.html' %}
{% set context = data.text %}
{% set graphicTitle = 'Headline from AI graphic' %}
{% set graphicDesc = 'Description of graphic' %}
{% set graphicSource = 'Source from AI graphic' %}
{% set graphicCredit = 'Credit from AI graphic' %}
{% block  content %}
<div class="app" data-graphic>
	<h1 class="graphic-title" data-title>{{ context.headline }}</h1>
	{{ prose(context.prose, context, graphicData) }}
	{% set ai2html = "border-map-full" %}
	{% include "ai2html-output/" + ai2html + ".html" %}
	<ul class="graphic-footer">
		<li>Note: {{ context.note }}</li>
		<li data-source>Source: {{ context.source }}</li>
		<li data-credit>Credit: {{ context.credit }}</li>
	</ul>
</div>
{% endblock  content %}
```

### Other metadata

Along with HTML selectors, we also get metadata about graphics through the `project.config.js`. These are global to the whole project and the same for every graphic in the project.

Project config keys output in `manifest.json`
- `createMonth`
- `createYear`
- `id`
- `tags`
- `parserOptions`
	- `appleNewsIgnore` - This is an array of files or folders that should be flagged in the CMS as not compatible with Apple News. Use this for graphics that are too dynamic to be accurately captured in a screenshot.

### Sample `manifest.json` output

```json
[
  {
    "title": "Title of graphic",
    "description": "Description of graphic",
    "graphicPath": "https://graphics.texastribune.org/graphics/new-test-2-2021-02/static/",
    "createMonth": "02",
    "createYear": "2021",
    "credits": ["Mandi Cai", "Darla Cameron", "Carla Astudillo", "Chris Essig"],
    "id": "uniqueString",
    "label": "static/index.html",
    "links": [
      {
        "url": "https://www.texastribune.org/series/news-apps-graphics-databases/",
        "text": "See more graphics like this",
        "isCTA": true
      }
    ],
    "previews": {
      "large": "https://graphics.texastribune.org/graphics/new-test-2-2021-02/static/preview-large.png",
      "small": "https://graphics.texastribune.org/graphics/new-test-2-2021-02/static/preview-small.png"
    },
    "showInAppleNews": true,
    "source": "Texas Department of State Health Services and U.S. Census ACS 2018 population estimates"
  }
]

```


### How it works

The `npm run parse` step will use [Puppeteer](https://github.com/puppeteer/puppeteer) and a local Chrome install to emulate the project in a browser. This will help build metadata based on a graphic's HTML and export image-based previews of the graphic as well as a manifest of all the graphics in the project (`manifest.json`).

#### Troubleshooting
By default, this process assumes you're using MacOS. To change this for other operating systems, rerun the command with the correct install path variable: `CHROME_INSTALL_PATH="local/path/to/chrome" npm run parse`.
