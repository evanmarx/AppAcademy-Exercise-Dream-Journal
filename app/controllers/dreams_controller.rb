class DreamsController < ApplicationController

  def index
    respond_to do |format|
      format.html {render :index }
      format.json { render :json => [ Dream.all, Theme.all ] }
    end
  end

  def create
    @dream = Dream.new(params[:dream])
    @dream.themes.build(params[:theme])
    @dream.save!


    respond_to do |format|
      format.json { render :json => @dream}
    end
  end

end
