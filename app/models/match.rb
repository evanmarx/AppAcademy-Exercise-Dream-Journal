class Match < ActiveRecord::Base
  attr_accessible :theme_id, :dream_id

  belongs_to :dream
  belongs_to :theme
end