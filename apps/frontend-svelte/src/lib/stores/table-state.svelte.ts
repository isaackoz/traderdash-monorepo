import type {
	ColumnFiltersState,
	PaginationState,
	SortingState,
	Updater,
	VisibilityState
} from '@tanstack/table-core';

type TableStateInit = {
	id: string;
};

class TableState {
	private _id: string;
	pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	sorting = $state<SortingState>([]);
	columnFilters = $state<ColumnFiltersState>([]);
	columnVisibility = $state<VisibilityState>({});

	constructor(props: TableStateInit) {
		this._id = props.id;
	}

	updatePagination(updater: Updater<PaginationState>) {
		if (typeof updater === 'function') {
			this.pagination = updater(this.pagination);
		} else {
			this.pagination = updater;
		}
		this.updateLocalStorage();
	}

	updateLocalStorage() {
		localStorage.setItem('tableState', JSON.stringify(this));
	}
}

export const tableStateStore = (props: TableStateInit) => new TableState(props);
