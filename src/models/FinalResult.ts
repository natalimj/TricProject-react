export interface FinalCategory {
    questionTheme : string,
    answerFirstCategory : string,
    answerSecondCategory : string
}

export interface CategoryRate {
    category :string,
    oppositeCategory : string,
    rate : number
}

export default interface IFinalResultData {
    categoryRateList : CategoryRate[],
    finalCategoryList : FinalCategory[]
}