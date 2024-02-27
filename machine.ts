// objects
class Machine {
    public stockLevel;
    public id: string;
    public lowStockWarning: boolean;
  
    constructor (id: string, stockLevel: number = 10, status?: boolean) {
        this.id = id;
        this.stockLevel = stockLevel;
        this.lowStockWarning = typeof status == 'boolean' ? status : this.stockLevel < 3 
    }
}

export {Machine}
  