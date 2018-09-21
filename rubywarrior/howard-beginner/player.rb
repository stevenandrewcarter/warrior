class Player
  def initialize
    @health = 20
    @direction = :forward
  end

  def warrior_should_rest(warrior)
    # Check if health is low
    if warrior.health < 16
      # Health is low! Check if still taking damamge
      if @health == warrior.health
        # Not taking damage, rest!
        warrior.rest!
        @health = warrior.health + 2
      else
        # Still taking damage, if too low move away
        direction = @direction
        if warrior.health <= 10
          direction = @direction == :backward ? :forward : :backward
        end
        warrior.walk! direction
        @health = warrior.health
      end
    else
      warrior.walk! @direction
      @health = warrior.health if warrior.health == 10
    end
  end

  def look_around(warrior)
    if @health > warrior.health
      warrior.walk! @direction
      @health = warrior.health
      return true
    end
    spaces = warrior.look
    spaces.each do |space|
      return false if space.captive?
      if space.enemy?
        warrior.shoot! @direction
        return true
      end
    end
    false
  end

  def play_turn(warrior)
    if warrior.feel(@direction).empty?
      if warrior.health <= @health
        warrior_should_rest warrior unless look_around(warrior)
      else
        warrior_should_rest warrior
      end
    else
      warrior.pivot! if warrior.feel(@direction).wall?
      warrior.rescue! @direction if warrior.feel(@direction).captive?
      warrior.attack! @direction if warrior.feel(@direction).enemy?
      @health = warrior.health
    end
  end
end
