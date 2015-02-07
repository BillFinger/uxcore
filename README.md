# uxcore

## installation
```sh
mkdir uxcore && cd $_
echo "# uxcore" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/BillFinger/uxcore.git
git push -u origin master
```
## Updates

### v0.0.1 (master)
- add pagination directive ngTablePagination [(see usage)](https://github.com/esvit/ng-table/blob/master/examples/demo28.html)
- rename filter.name to filter.$$name according to issue #196
- add debugMode setting
- add defaultSort setting
- add filterDelay setting
- add multisorting (click on header with Ctrl-key)
- add css classes (ng-table-pager, ng-table-pagination, ng-table-counts)
