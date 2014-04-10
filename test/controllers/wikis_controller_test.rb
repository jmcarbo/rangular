require 'test_helper'

class WikisControllerTest < ActionController::TestCase
  setup do
    @wiki = wikis(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:wikis)
  end

  test "should create wiki" do
    assert_difference('Wiki.count') do
      post :create, wiki: { body: @wiki.body, title: @wiki.title }
    end

    assert_response 201
  end

  test "should show wiki" do
    get :show, id: @wiki
    assert_response :success
  end

  test "should update wiki" do
    put :update, id: @wiki, wiki: { body: @wiki.body, title: @wiki.title }
    assert_response 204
  end

  test "should destroy wiki" do
    assert_difference('Wiki.count', -1) do
      delete :destroy, id: @wiki
    end

    assert_response 204
  end
end
