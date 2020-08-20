# GEIS

GEIS is a chrome extension to extract information about entities from google searches. Starting with a google search query with a wildcard (*), it will try to extract the part of the snippets that replace the wildcard and make a list that can be saved.

For example, with the query `"* is a german car manufacturer"`, the extension will extract a list of possible replacements for `*` from the result pages, such as

```
volkswagen, bmw, ruf automobile gmbh, ford-werke gmbh, audi, weineck engineering, executive summary porsche, wiesmann gt mf5 wiesmann, mercedes, mercedes-benz, the gemballa gmbh, pfister, opel, daimler benz ag, benz-daimler ag, this
```

From the popup window, the list for every search is displayed, with buttons to clear the list for a given search, and to save the results as a csv file.