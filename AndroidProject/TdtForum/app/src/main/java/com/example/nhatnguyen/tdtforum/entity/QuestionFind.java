package com.example.nhatnguyen.tdtforum.entity;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

/**
 * Created by nhatnguyen on 28/12/2016.
 */

public class QuestionFind {
    @SerializedName("questions")
    @Expose
    QuestionSearch questionSearch;
    public QuestionSearch getQuestionSearch() {
        return questionSearch;
    }

    public void setQuestionSearch(QuestionSearch questionSearch) {
        this.questionSearch = questionSearch;
    }





}
