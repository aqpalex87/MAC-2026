import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';

export function ConvertTreeToList(treeData: any[]): any[] {
    const result: any[] = [];

    function flatten(node: any) {
        result.push(node.data);
        if (node.children && node.children.length > 0) {
            for (const child of node.children) {
                flatten(child);
            }
        }
    }
    for (const node of treeData) {
        flatten(node);
    }
    return result;
}

@Injectable({
    providedIn: 'root'
})
export class SharedService {

    constructor(private store: Store<AppState>) { }

    convertTreeToList(data: any[]) {
        return ConvertTreeToList(data);
    }

    expandir(data: any[]) {
        data.forEach(node => {
            node.expanded = true;
            if (node.children && node.children.length > 0) {
                node.children.forEach(child => {
                    child.expanded = true;
                });
            }
        });
        return [...data];
    }

}
