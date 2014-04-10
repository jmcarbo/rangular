class AuthController < ApplicationController
  protect_from_forgery with: :null_session

    def create
      # Example user, no actual authentication
      user = auth_params.merge(id: 1)
        render json: { token: JWT.encode(user, 'secret') }
    end
    
    private
    #                
    def auth_params
      params.require(:auth).permit(:username, :password)
    end
end
