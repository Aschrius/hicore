Ext.define('Tool.base.ux.HandleProxy', {
    extend: 'Ext.data.proxy.Client',
    alias: 'proxy.handleproxy',
    isMemoryProxy: true,
    config: {
        enablePaging: true,
        extraParams: {},
        data: {
            $value: null,
            merge: function (newValue, currentValue, target, mixinClass) {
                if (Ext.isArray(newValue)) {
                    return Ext.Array.clone(newValue);
                } else {
                    return Ext.clone(newValue);
                }
            }
        }
    },
    finishOperation: function (operation) {
        var i = 0,
            recs = operation.getRecords(),
            len = recs.length;

        for (i; i < len; i++) {
            recs[i].dropped = !!operation.isDestroyOperation;
            recs[i].commit();
        }
        operation.setSuccessful(true);
    },
    create: function (operation) {
        this.finishOperation(operation);
    },
    update: function (operation) {
        this.finishOperation(operation);
    },
    erase: function (operation) {
        this.finishOperation(operation);
    },
    read: function (operation) {
        var me = this;
        me.handle({start: operation.getStart(), limit: operation.getLimit()}, function (result) {

            var total = result.total;
            var limit = result.limit;
            var data = result.data;
            operation.setLimit(limit);

            var resultSet = me.getReader().read(data),
                records = resultSet.getRecords(),
                sorters = operation.getSorters(),
                grouper = operation.getGrouper(),
                filters = operation.getFilters(),
                start = operation.getStart(),
                limit = operation.getLimit(),
                meta;

            // Apply filters, sorters, and start/limit options
            if (operation.process(resultSet, null, null, false) !== false) {
                // Filter the resulting array of records
                if (filters && filters.length) {
                    // Total will be updated by setting records
                    resultSet.setRecords(records = Ext.Array.filter(records, Ext.util.Filter.createFilterFn(filters)));
                    resultSet.setTotal(total);
                }

                // Remotely, grouper just mean top priority sorters
                if (grouper) {
                    // Must concat so as not to mutate passed sorters array which could be the items property of the sorters collection
                    sorters = sorters ? sorters.concat(grouper) : sorters;
                }

                // Sort by the specified grouper and sorters
                if (sorters && sorters.length) {
                    resultSet.setRecords(records = Ext.Array.sort(records, Ext.util.Sortable.createComparator(sorters)));
                }

                // Reader reads the whole passed data object.
                // If successful and we were given a start and limit, slice the result.
                if (me.getEnablePaging() && start !== undefined && limit !== undefined) {

                    // Attempt to read past end of memory dataset - convert to failure
                    if (start >= resultSet.getTotal()) {
                        resultSet.setConfig({
                            success: false,
                            records: [],
                            total: 0
                        });
                    }
                    // Range is valid, slice it up.
                    else {
                        //resultSet.setRecords(Ext.Array.slice(records, start, start + limit));
                        resultSet.setRecords(records);
                    }
                }


                // new
                resultSet.setRecords(records = Ext.Array.sort(records, Ext.util.Sortable.createComparator(sorters)));
                resultSet.setTotal(total);
                operation.setCompleted();

                // This will fire the 'metachange' event which the Store processes to fire its own 'metachange'
                if (meta = resultSet.getMetadata()) {
                    me.onMetaChange(meta);
                }
            }

        });


    },

    clear: Ext.emptyFn
});
