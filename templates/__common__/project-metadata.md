## Graphics and features metadata

In order to keep track of our graphics and features, metadata is grabbed from each project when we deploy them! (Hooray!) Metadata is scraped via specific selectors present in the HTML. The values for these selectors are parsed and output into a `manifest.json` file.

The metadata from `manifest.json` is then pasted into our [work log](https://docs.google.com/spreadsheets/d/1hCP5zGx8dNxk59gI9wBSFY2juJVM8OFCDY45VnNb2nI/edit#gid=965603489), which powers the CMS graphics plugin. Only embeddable graphics are present in the plugin — full-page features are not. The plugin surfaces our graphics for editors to embed them into stories.

| Selector/Variable | Alt Text | Example | Output in manifest.json |
|--|--|--|--|
| `[data-graphic]` or `[data-feature]` | If present, the HTML of the page will be parsed for metadata and surfaced in the CMS | `<div class="app" data-graphic>` or `<main data-feature>` | N/A - If no `[data-graphic]` or `[data-feature]` selector is found, the project won't output in manifest. |
| `{{ graphicTitle }}` or `[data-title]` | The title of the project in the CMS. **If this is missing in an embeddable graphic, the graphic will not surface in the CMS.** | `{% set  graphicTitle = 'Some title' %}` or `<h1 class="graphic-title" data-title>Some title</h1>` | `title: string` |
| `{{ graphicAltText }}` | The alt text of the graphic in the CMS. This will also be read by screenreaders in platforms like Apple News. | `{% set graphicAltText = 'This is a bar chart showing xyz' %}` | `altText: string` |
| `{{ graphicCaption }}` or `[data-caption]` | The caption of the graphic in the CMS. The text typically below the title. | `{% set graphicCaption = 'Summarizing statement about the values in the graphic.' %}` or `<span data-caption>{{ prose(context.prose, context, graphicData) }}</span>` | `caption: string` |
| `{{ graphicNote }}` or `[data-note]` | Note or disclaimer attached to the graphic. | `{% set graphicNote = 'Important disclaimer about this graphic.' %}` or `<li data-note>Note: Important disclaimer about this graphic.</li>` | `note: string` |
| `{{ graphicSource }}` or `[data-source]` | The source of the graphic in the CMS | `{% set  graphicSource = 'TXDOT' %}` or `<li data-source>Source: TXDOT</li>` | `source: string` |
| `{{ graphicCredit }}` or `[data-credit]` | The author names for the project in the CMS. | `{% set  graphicCredit = 'Texas Tribune Staff' %}` or `<li data-credit>Texas Tribune Staff</li>`  | `credits: array` |
| `{{ graphicTags }}` | The tags for the project in the CMS. | `{% set graphicTags = context.guten_tags %}` | `tags: array` |

The metadata as a variable, i.e. `graphicTitle` and `graphicCaption`, takes precedent over metadata in selectors, i.e. `[data-title]` and `[data-caption]`.

### Full example with an embeddable graphic

`context` is data from the project's ArchieML Google Doc.

```html
{% extends 'base.html' %}
{% set context = data.text %}
{% set graphicAltText = context.alttext %}
{% set graphicTags = context.guten_tags %}
{% block content %}
<div class="app" data-graphic>
  <h1 class="graphic-title" data-title>{{ context.headline }}</h1>
  <span data-caption>{{ prose(context.prose, context, graphicData) }}</span>
  <div id="graphic" class="graphic"></div>
  <ul class="graphic-footer">
    <li data-note>Note: {{ context.note }}</li>
    <li data-source>Source: {{ context.source }}</li>
    <li data-credit>Credit: {{ context.credit }}</li>
  </ul>
</div>
{% endblock content %}
```

### Full example with a full-page feature

`context` is data from the project's ArchieML Google Doc.

```html
{% set graphicTags = context.guten_tags %}
<main data-feature>
  <article class="has-giant-btm-marg">
    {% block content %}
      <div class="has-page-padding has-giant-btm-marg">
        <header class="t-align-center">
          <h1 class="l-container l-container--m t-headline t-serif t-lh-s has-s-btm-marg" data-title>{{ context.headline | widont }}</h1>
          <p class="t-byline t-links t-uppercase t-lsp-m t-size-xs has-text-gray-dark has-b-btm-marg">
            <span class="t-byline__item">By <span data-credit>{%- for author in context.authors -%}
            {% if not loop.last %}{{ authorComma() }}{% elif not loop.first %} and{% endif %} <span class="l-display-ib">{{ author }}</span>
            {%- endfor -%}</span>
            </span>
          </p>
        </header>
      </div>
    {% endblock content %}
  </article>
</main>
```

### Full example with ai2html graphic

Sometimes in Illustrator graphics, we set the title and other info in the Illustrator file itself and not the HTML, so we'd need to add those as nunjucks variables to surface the metadata. `context` is data from the project's ArchieML Google Doc.

```html
{% extends 'base.html' %}
{% set context = data.text %}
{% set graphicTitle = context.headline %}
{% set graphicCaption = context.prose %}
{% set graphicAltText = context.alttext %}
{% set graphicNote = context.note %}
{% set graphicSource = context.source %}
{% set graphicCredit = context.credit %}
{% set graphicTags = context.guten_tags %}
{% block content %}
<div class="app" data-graphic>
  <h1 class="graphic-title" data-title>{{ context.headline | widont }}</h1>
  <span data-caption>{{ prose(context.prose, context, graphicData) }}</span>
  {% set ai2html = "border-map-full" %}
  {% include "ai2html-output/" + ai2html + ".html" %}
  <ul class="graphic-footer">
    <li data-note>Note: {{ context.note }}</li>
    <li data-source>Source: {{ context.source }}</li>
    <li data-credit>Credit: {{ context.credit }}</li>
  </ul>
</div>
{% endblock content %}
```

### Other metadata

Along with HTML selectors, we also get metadata about graphics through the `project.config.js`. These are global to the whole project.

Project config keys output in `manifest.json`

- `type`
- `bucket`
- `createMonth`
- `createYear`
- `lastBuildTime`
- `folder`
- `id`
- `parserOptions`
  - `appleNewsIgnore` - **Only applies to embeddable graphics** This is an array of files or folders that should be flagged in the CMS as not compatible with Apple News. Use this for graphics that are too dynamic to be accurately captured in a screenshot.

### Ignoring projects

If any projects should be ignored in `manifest.json`, add the paths in `metadataIgnore` in `project.config.js`.

- `parserOptions`
  - `metadataIgnore` - This is an array of files or folders that should not be parsed for metadata and displayed in the CMS graphics plugin. For example, any graphics or features created for testing but are not publishable should be added here.

### Sample `manifest.json` output for embeddable graphics

```json
[
  {
    "type": "graphic",
    "title": "Title of graphic",
    "altText": "Alt text of graphic",
    "bucket": "graphics.texastribune.org",
    "projectPath": "graphics/new-test-2-2021-02/static",
    "projectURL": "https://graphics.texastribune.org/graphics/new-test-2-2021-02/static/",
    "caption": "Caption of graphic",
    "createMonth": "02",
    "createYear": "2021",
    "credits": ["Mandi Cai", "Darla Cameron", "Carla Astudillo", "Chris Essig"],
    "folder": "graphics/new-test-2-2021-02",
    "id": "uniqueString",
    "lastBuildTime": "2021-04-22T19:28:30.269Z",
    "label": "static/index.html",
    "links": [
      {
        "url": "https://www.texastribune.org/series/news-apps-graphics-databases/",
        "text": "See more graphics like this",
        "isCTA": true
      }
    ],
    "note": "Note: Texas Department of State Health Services was missing data last year.",
    "previews": {
      "large": "https://graphics.texastribune.org/graphics/new-test-2-2021-02/static/preview-large.png",
      "small": "https://graphics.texastribune.org/graphics/new-test-2-2021-02/static/preview-small.png"
    },
    "showInAppleNews": true,
    "source": "Source: Texas Department of State Health Services and U.S. Census ACS 2018 population estimates",
    "tags": ["subject-politics"]
  }
]
```

### Sample `manifest.json` output for full-page features

```json
[
  {
    "type": "feature",
    "title": "Title of the feature",
    "bucket": "apps.texastribune.org",
    "projectPath": "features/2022/new-test-2-2021-02",
    "projectURL": "https://apps.texastribune.org/features/2022/new-test-2-2021-02/",
    "createMonth": "04",
    "createYear": "2022",
    "credits": ["Texas Tribune Staff"],
    "folder": "features/2022/new-test-2-2021-02",
    "id": "uniqueString",
    "lastBuildTime": "2022-04-21T15:49:19.130Z",
    "label": "index.html",
    "tags": ["subject-politics"]
  }
]
```

### How it works

The `npm run parse` step will use [Puppeteer](https://github.com/puppeteer/puppeteer) and a local Chrome install to emulate the project in a browser. This will help build metadata based on a project's HTML and, for embeddable graphics, export image-based previews of the graphic as well as a manifest of all the metadata (`manifest.json`).

#### Troubleshooting

By default, this process assumes you're using MacOS. To change this for other operating systems, rerun the command with the correct install path variable: `CHROME_INSTALL_PATH="local/path/to/chrome" npm run parse`.
