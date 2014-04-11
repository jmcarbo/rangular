class WikisController < ApplicationController
  protect_from_forgery except: [:create, :update]
  before_action :validate_token

  # GET /wikis
  # GET /wikis.json
  def index
    @wikis = Wiki.all

    render json: @wikis
  end

  # GET /wikis/1
  # GET /wikis/1.json
  def show
    @wiki = Wiki.find(params[:id])

    render json: @wiki
  end

  # POST /wikis
  # POST /wikis.json
  def create
    @wiki = Wiki.new(params[:wiki])

    if @wiki.save
      render json: @wiki, status: :created, location: @wiki
    else
      render json: @wiki.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /wikis/1
  # PATCH/PUT /wikis/1.json
  def update
    @wiki = Wiki.find(params[:id])

    if @wiki.update(params.require(:wiki).permit(:title, :body, :id, :created_at, :updated_at))
      head :no_content
    else
      render json: @wiki.errors, status: :unprocessable_entity
    end
  end

  # DELETE /wikis/1
  # DELETE /wikis/1.json
  def destroy
    @wiki = Wiki.find(params[:id])
    @wiki.destroy

    head :no_content
  end

  def validate_token
    begin
      token = request.headers['Authorization'].split(' ').last
      JWT.decode(token, 'secret')
    rescue
      render nothing: true, status: :unauthorized
    end
  end
end
