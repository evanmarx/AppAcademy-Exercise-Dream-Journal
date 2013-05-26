class Theme < ActiveRecord::Base
  attr_accessible :title, :dream_id

  belongs_to :dream

  # validates :title, :presence => true
end