class APIFilters {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    //search
    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {};

        this.query = this.query.find({...keyword});
        return this
    }

    //filtering
    filters(){
        const queryCopy = {...this.queryStr};

        //field to remove
        const fieldtoRemove = ['keyword', 'page'];
        fieldtoRemove.forEach((element) => delete queryCopy[element]);

        //filter for price, category, rating, and etc

        let queryStr = JSON.stringify(queryCopy);
    
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

        console.log(queryStr)

        this.query = this.query.find(JSON.parse(queryStr));
        return this

    }

    //pagination
    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

export default APIFilters;